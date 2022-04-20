---
sidebar_position: 1
---

# อะไรที่ไม่เกี่ยวกับ GitHub Actions


```powershell
# https://docs.microsoft.com/en-us/azure/automation/learn/powershell-runbook-managed-identity
# Require: Enable the common alert schema
# https://techcommunity.microsoft.com/t5/azure-database-support-blog/how-to-auto-scale-azure-sql-databases/ba-p/2235441
param
(
    [Parameter (Mandatory = $false)]
    [object]$WebhookData,
    [string]$ResourceGroup = "rg-storm-hotfix",
    [string]$ManagedIdentity_Method = "SA",
    [string]$ManagedIdentity_UserAssigned = "Runbook-Auto-Scale",
    [string]$Min_DTU = "S0",
    [string]$Max_DTU = "S2",
    # UP or DOWN
    [string]$Scale_Mode = "UP"
)


####################################################################
#            Validate Input
####################################################################

# Because Azure SQL tiers cannot be obtained programatically, we need to hardcode them as below.
$DtuTiers = @('S0', 'S1', 'S2', 'S3', 'S4', 'S6', 'S7', 'S9', 'S12', 'P1', 'P2', 'P4', 'P6', 'P11', 'P15')

$automationAccount = "HotfixAutomation"

if (($Scale_Mode -ne "UP") -and ($Scale_Mode -ne "DOWN")) {
    Write-Output "Invalid Scale Mode. Choose UP or DOWN."
    exit
}

function Find-Array {
    param (
        [string]$Search,
        [string[]]$Array
    )
    
    for ($i = 0; $i -lt $Array.length; $i++) {
        if ($Array[$i] -eq $Search) {
            Return $i
        }
    }
    Return -1
}

$MaxDtuIndex = Find-Array -Array $DtuTiers -Search $Min_DTU
$MinDtuIndex = Find-Array -Array $DtuTiers -Search $Max_DTU

if ($MaxDtuIndex -lt 0) {
    Write-Output "Cannot find Max DTU ($CurrentDtu) in DTU List"
    exit
} 
if ($MinDtuIndex -lt 0) {
    Write-Output "Cannot find Min DTU ($CurrentDtu) in DTU List"
    exit
}

####################################################################
#            Authen
####################################################################

# Ensures you do not inherit an AzContext in your runbook
Disable-AzContextAutosave -Scope Process | Out-Null

# Connect using a Managed Service Identity
$AzureContext = (Connect-AzAccount -Identity).context

# set and store context
$AzureContext = Set-AzContext -SubscriptionName $AzureContext.Subscription `
    -DefaultProfile $AzureContext

if ($ManagedIdentity_Method -eq "SA") {
    Write-Output "Using system-assigned managed identity"
}
elseif ($ManagedIdentity_Method -eq "UA") {
    Write-Output "Using user-assigned managed identity"

    # Connects using the Managed Service Identity of the named user-assigned managed identity
    $identity = Get-AzUserAssignedIdentity -ResourceGroupName $ResourceGroup `
        -Name $ManagedIdentity_UserAssigned -DefaultProfile $AzureContext

    # validates assignment only, not perms
    if ((Get-AzAutomationAccount -ResourceGroupName $ResourceGroup `
                -Name $automationAccount `
                -DefaultProfile $AzureContext).Identity.UserAssignedIdentities.Values.PrincipalId.Contains($identity.PrincipalId)) {
        $AzureContext = (Connect-AzAccount -Identity -AccountId $identity.ClientId).context

        # set and store context
        $AzureContext = Set-AzContext -SubscriptionName $AzureContext.Subscription -DefaultProfile $AzureContext
    }
    else {
        Write-Output "Invalid or unassigned user-assigned managed identity"
        exit
    }
}
else {
    Write-Output "Invalid method. Choose UA or SA."
    exit
}

Write-Output "Account ID of current context: " $AzureContext.Account.Id


####################################################################
#            Define Function
####################################################################

function Scale-Up {

    param (
        [string]$CurrentDtu,
        [string]$ResourceGroupName,
        [string]$DatabaseName,
        [string]$ServerName
    )


    # Write-Output "Current DTU ($CurrentDtu)."
    if ($CurrentDtu -eq $DtuTiers[$DtuTiers.length-1] -or $CurrentDtu -eq $Max_DTU) {
        Write-Output "DTU database is already at highest tier ($CurrentDtu)."
    }
    else {
        $CurrentDtuIndex = Find-Array -Array $DtuTiers -Search $CurrentDtu
        if($CurrentDtuIndex -ge 0){
            $RequestedDtuTier = $DtuTiers[$CurrentDtuIndex + 1];
            Set-AzSqlDatabase -ResourceGroupName $ResourceGroupName -DatabaseName $DatabaseName -ServerName $ServerName -DefaultProfile $AzureContext -RequestedServiceObjectiveName $RequestedDtuTier
            Write-Output "Scaling Up to Service Objective: $RequestedDtuTier"
        } else {
            Write-Output "Cannot find Service Objective ($CurrentDtu) in DTU List"
            Write-Output "Cancelled Scaling Up"
        }
    }
}

function Scale-Down {

    param (
        [string]$CurrentDtu,
        [string]$ResourceGroupName,
        [string]$DatabaseName,
        [string]$ServerName
    )

    if ($CurrentDtu -eq $DtuTiers[0] -or $CurrentDtu -eq $Min_DTU) {
        Write-Output "DTU database is already at lowest tier ($CurrentDtu)."
    }
    else {
        $CurrentDtuIndex = Find-Array -Array $DtuTiers -Search $CurrentDtu
        if($CurrentDtuIndex -ge 0){
            $RequestedDtuTier = $DtuTiers[$CurrentDtuIndex - 1];
            Set-AzSqlDatabase -ResourceGroupName $ResourceGroupName -DatabaseName $DatabaseName -ServerName $ServerName -DefaultProfile $AzureContext -RequestedServiceObjectiveName $RequestedDtuTier
            Write-Output "Scaling Down to Service Objective: $RequestedDtuTier"
        } else {
            Write-Output "Cannot find Service Objective ($CurrentDtu) in DTU List"
            Write-Output "Cancelled Scaling down"
        }
    }
}


# Get-AzSqlDatabase  -ResourceGroupName "rg-storm-hotfix" -DatabaseName "storm_demo" -ServerName "stormhotfix" -DefaultProfile $AzureContext

####################################################################
#            Start Runbook with WebHook
####################################################################

# If there is webhook data coming from an Azure Alert, go into the workflow.
if ($WebhookData) {
    Write-Output "$WebhookData"

    # Get the data object from WebhookData
    $WebhookBody = (ConvertFrom-Json -InputObject $WebhookData.RequestBody)

    # Get the info needed to identify the SQL database (depends on the payload schema)
    $schemaId = $WebhookBody.schemaId
    Write-Verbose "schemaId: $schemaId" -Verbose
    if ($schemaId -eq "azureMonitorCommonAlertSchema") {
        # This is the common Metric Alert schema (released March 2019)
        $Essentials = [object] ($WebhookBody.data).essentials
        Write-Output $Essentials
        # Get the first target only as this script doesn't handle multiple
        $alertTargetIdArray = (($Essentials.alertTargetIds)[0]).Split("/")
        $SubId = ($alertTargetIdArray)[2]
        $ResourceGroupName = ($alertTargetIdArray)[4]
        $ResourceType = ($alertTargetIdArray)[6] + "/" + ($alertTargetIdArray)[7]
        $ServerName = ($alertTargetIdArray)[8]
        $DatabaseName = ($alertTargetIdArray)[-1]
        $status = $Essentials.monitorCondition
    }
    else {
        # Schema not supported
        Write-Error "The alert data schema - $schemaId - is not supported."
    }
    # If the alert that triggered the runbook is Activated or Fired, it means we want to autoscale the database.
    # When the alert gets resolved, the runbook will be triggered again but because the status will be Resolved, no autoscaling will happen.
    if (($status -eq "Activated") -or ($status -eq "Fired")) {
        Write-Output "resourceType: $ResourceType"
        Write-Output "resourceName: $DatabaseName"
        Write-Output "serverName: $ServerName"
        Write-Output "resourceGroupName: $ResourceGroupName"
        Write-Output "subscriptionId: $SubId"

        # Gets the current database details, from where we'll capture the Edition and the current service objective.
        # With this information, the below if/else will determine the next tier that the database should be scaled to.
        # Example: if DTU database is S6, this script will scale it to S7. This ensures the script continues to scale up the DB in case CPU keeps pegging at 100%.

        $currentDatabaseDetails = Get-AzSqlDatabase -ResourceGroupName $ResourceGroupName -DatabaseName $DatabaseName -ServerName $ServerName -DefaultProfile $AzureContext
        $edition = $currentDatabaseDetails.Edition
        $serviceObjective = $currentDatabaseDetails.CurrentServiceObjectiveName
        Write-Output "Database Edition: $edition"
        Write-Output "Database Service Objective: $serviceObjective"

        if (($currentDatabaseDetails.Edition -eq "Basic") -Or ($currentDatabaseDetails.Edition -eq "Standard") -Or ($currentDatabaseDetails.Edition -eq "Premium")) {
            Write-Output "Database is DTU model."
            if($Scale_Mode -eq "UP") {
                # Scale Up
                Scale-Up -CurrentDtu $serviceObjective -ResourceGroupName $ResourceGroupName -DatabaseName $DatabaseName -ServerName $ServerName
            } 
            elseif($Scale_Mode -eq "DOWN"){
                # Scale Up
                Scale-Down -CurrentDtu $serviceObjective -ResourceGroupName $ResourceGroupName -DatabaseName $DatabaseName -ServerName $ServerName
            }
        }
        else {
            Write-Output "Not support vCore model Database"
        }

    }
    else {
        Write-Output "Skipping scaling because the status is $status"
    }
}
else {
    # Error
    Write-Error "This runbook is meant to be started from an Azure alert webhook only."
}
```