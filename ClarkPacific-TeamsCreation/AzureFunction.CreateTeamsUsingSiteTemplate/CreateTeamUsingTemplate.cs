using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.SharePoint.Client;
using OfficeDevPnP.Core.Sites;

namespace AzureFunction.CreateTeamsUsingSiteTemplate
{
    public static class CreateTeamUsingTemplate
    {
        [FunctionName("CreateTeamUsingTemplate")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            // parse query parameter
            string name = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "name", true) == 0)
                .Value;

            if (name == null)
            {
                // Get request body
                dynamic data = await req.Content.ReadAsAsync<object>();
                name = data?.name;
            }
            string siteUrl = string.Empty;
            string createdTeamSiteUrl = string.Empty;
            string adminUserEmail = Environment.GetEnvironmentVariable("createTeamsAdminUserEmail");
            if (string.IsNullOrWhiteSpace(adminUserEmail))
                adminUserEmail = "sunil@cyclotrondev.com";
            log.Info("Admin UserEmail : " + adminUserEmail);
            string adminPassword = Environment.GetEnvironmentVariable("createTeamsAdminUserPassword");
            if (string.IsNullOrWhiteSpace(adminPassword))
                adminPassword = "Cyclo@%&2020";
            log.Info("Admin Password : " + adminPassword);
            string tenantSiteURL = Environment.GetEnvironmentVariable("createTeamsTenantURL");
            if (string.IsNullOrWhiteSpace(tenantSiteURL))
                tenantSiteURL = "https://cyclotrondev.sharepoint.com/";
            log.Info("Tenant URL : " + tenantSiteURL);
            string sharepointSiteURL = Environment.GetEnvironmentVariable("createTeamsSharepointSiteURL");
            if (string.IsNullOrWhiteSpace(sharepointSiteURL))
                sharepointSiteURL = "https://cyclotrondev.sharepoint.com/sites/ClarkPacific/";
            log.Info("SharePoint Site URL : " + sharepointSiteURL);
            string sharepointListName = Environment.GetEnvironmentVariable("createTeamsSharepointListName");
            if (string.IsNullOrWhiteSpace(sharepointListName))
                sharepointListName = "Projects";
            log.Info("SharePoint List Name : " + sharepointListName);
            System.Security.SecureString secureString = new System.Security.SecureString();
            foreach (char ch in adminPassword)
            {
                secureString.AppendChar(ch);
            }

            Dictionary<string, string> siteInfo = new Dictionary<string, string>();
            OfficeDevPnP.Core.AuthenticationManager authManager = new OfficeDevPnP.Core.AuthenticationManager();
            string camlQuery =
                "<View>" +
                    "<Query>" +
                        "<Where>" +
                            "<Eq>" +
                                "<FieldRef Name='HasSiteCreated' />" +
                                "<Value Type='Boolean'>No</Value>" +
                            "</Eq>" +
                        "</Where>" +
                    "</Query>" +
                "</View>";
            CamlQuery query = new CamlQuery();
            query.ViewXml = camlQuery;
            log.Info("CAML Query : " + camlQuery);
            using (var context = authManager.GetSharePointOnlineAuthenticatedContextTenant(sharepointSiteURL, adminUserEmail, secureString))
            {
                List list = context.Web.Lists.GetByTitle(sharepointListName);
                if (list != null)
                {
                    log.Info("List : " + sharepointListName + " Found.");
                    ListItemCollection licollection = list.GetItems(query);
                    context.Load(licollection);
                    context.ExecuteQuery();
                    foreach (ListItem item in licollection)
                    {
                        siteInfo.Add("Id", item["ID"].ToString());
                        siteInfo.Add("Title", item["Title"] == null ? "" : item["Title"].ToString());
                        siteInfo.Add("JobId", item["JOBID"] == null ? "" : item["JOBID"].ToString());
                        siteInfo.Add("ProductType", item["ProductType"] == null ? "" : item["ProductType"].ToString());
                        siteInfo.Add("BuildingType", item["BuildingType"] == null ? "" : item["BuildingType"].ToString());
                        siteInfo.Add("ContractValue", item["ContractValue"] == null ? "" : item["ContractValue"].ToString());
                        siteInfo.Add("ProjectType", item["ProjectType"] == null ? "" : item["ProjectType"].ToString());
                        siteInfo.Add("ProjectSiteLink", item["ProjectSiteLink"] == null ? "" : item["ProjectSiteLink"].ToString());

                        // Store SPM,PM,Jurisdiction, APM,PE user emails as owner emails
                        string ownerUsersEmailStr = "";
                        if (item["SPM"] != null)
                        {
                            FieldUserValue userValue = item["SPM"] as FieldUserValue;
                            if (userValue != null)
                            {
                                siteInfo.Add("SPM", userValue.Email);
                                ownerUsersEmailStr += userValue.Email + ";";
                            }
                        }

                        if (item["PM"] != null)
                        {
                            FieldUserValue userValue = item["PM"] as FieldUserValue;
                            if (userValue != null)
                            {
                                siteInfo.Add("PM", userValue.Email);
                                ownerUsersEmailStr += userValue.Email + ";";
                            }
                        }

                        if (item["Jurisdiction"] != null)
                        {
                            FieldUserValue userValue = item["Jurisdiction"] as FieldUserValue;
                            if (userValue != null)
                            {
                                siteInfo.Add("Jurisdiction", userValue.Email);
                                ownerUsersEmailStr += userValue.Email + ";";
                            }
                        }

                        if (item["APM"] != null)
                        {
                            FieldUserValue userValue = item["APM"] as FieldUserValue;
                            if (userValue != null)
                            {
                                siteInfo.Add("APM", userValue.Email);
                                ownerUsersEmailStr += userValue.Email + ";";
                            }
                        }

                        if (item["PE"] != null)
                        {
                            FieldUserValue userValue = item["PE"] as FieldUserValue;
                            if (userValue != null)
                            {
                                siteInfo.Add("PE", userValue.Email);
                                ownerUsersEmailStr += userValue.Email + ";";
                            }
                        }
                        if (!string.IsNullOrWhiteSpace(ownerUsersEmailStr))
                            siteInfo.Add("OwnerUsers", ownerUsersEmailStr);

                        string memberUsersEmailStr = "";
                        if (item["Members"] != null)
                        {
                            foreach (FieldUserValue userValue in item["Members"] as FieldUserValue[])
                            {
                                if (userValue != null)
                                    memberUsersEmailStr += userValue.Email + ";";
                            }
                        }
                        if (!string.IsNullOrWhiteSpace(memberUsersEmailStr))
                            siteInfo.Add("MemberUsers", memberUsersEmailStr);

                        siteInfo.Add("Client", item["Client"] == null ? "" : item["Client"].ToString());
                        // Added hardcode value for type for site creation 
                        siteInfo.Add("type", "teams");
                        log.Info("Processing Site : " + item["Title"].ToString());
                        var siteType = siteInfo["type"];

                        string existingGroupID = "";
                        switch (siteType.ToLower())
                        {
                            case "communicationsite":
                                var ctx = context.CreateSiteAsync(new CommunicationSiteCollectionCreationInformation
                                {
                                    Title = siteInfo["title"].ToString(),
                                    Owner = siteInfo["owner"].ToString(),
                                    Lcid = 1033,
                                    Description = siteInfo["description"].ToString(),
                                    Url = tenantSiteURL + "/sites/" + siteInfo["alias"].ToString(),
                                }).GetAwaiter().GetResult();
                                log.Info("Communication Site URL : " + tenantSiteURL + "/sites/" + siteInfo["alias"].ToString());
                                // Add OWner
                                User user = ctx.Web.EnsureUser(siteInfo["owner"].ToString());
                                ctx.Web.Context.Load(user);
                                ctx.Web.Context.ExecuteQueryRetry();
                                ctx.Web.AssociatedOwnerGroup.Users.AddUser(user);
                                ctx.Web.AssociatedOwnerGroup.Update();
                                ctx.Web.Context.ExecuteQueryRetry();
                                siteUrl = tenantSiteURL + "/sites/" + siteInfo["alias"].ToString();
                                break;
                            case "teamsite":
                                var ctxTeamsite = context.CreateSiteAsync(new TeamSiteCollectionCreationInformation
                                {
                                    DisplayName = siteInfo["Title"].ToString(),
                                    Description = siteInfo["Description"].ToString(),
                                    Alias = siteInfo["alias"].ToString().Replace("\r\n", "").Replace(" ", ""),
                                    IsPublic = false,
                                }).GetAwaiter().GetResult();
                                log.Info("Team Site URL : " + ctxTeamsite.Url);
                                siteUrl = ctxTeamsite.Url;
                                // Add OWner
                                User userTeamSite = ctxTeamsite.Web.EnsureUser(siteInfo["owner"].ToString());
                                ctxTeamsite.Web.Context.Load(userTeamSite);
                                ctxTeamsite.Web.Context.ExecuteQueryRetry();
                                ctxTeamsite.Web.AssociatedOwnerGroup.Users.AddUser(userTeamSite);
                                ctxTeamsite.Web.AssociatedOwnerGroup.Update();
                                ctxTeamsite.Web.Context.ExecuteQueryRetry();
                                break;
                            case "teams":
                                string token = Graph.getToken(log);
                                log.Info("Access Token: " + token);
                                string userId = string.Empty;
                                string groupId = string.Empty;
                                // Get all owner user ID's from email
                                string ownerUsersIDString = Graph.FormatUserIdFromUserEmail(token, ownerUsersEmailStr, log);
                                // Get all Member user ID's from email
                                string memberUsersIDString = Graph.FormatUserIdFromUserEmail(token, memberUsersEmailStr, log);                                

                                string teamTemplateGroupId = Environment.GetEnvironmentVariable("createTeamsTemplateGroupId");
                                if (string.IsNullOrWhiteSpace(teamTemplateGroupId))
                                    teamTemplateGroupId = "a714962d-3e90-44c5-842d-df9c25bb2b9a";
                                log.Info("Template Team ID : " + teamTemplateGroupId);

                                existingGroupID = Graph.getTeamsIdByMailNickNameName(token, siteInfo["Title"].ToString(), "", log);
                                if (string.IsNullOrWhiteSpace(existingGroupID)) { 
                                    // Decide to clone team using existing teams template or create completely new teams
                                    if (teamTemplateGroupId != null)
                                    {
                                        // Clone teams using existing teams group id
                                        var body = "{ 'displayName': '" + siteInfo["Title"].ToString() + "', 'description': '" + siteInfo["Title"].ToString() + "', 'mailNickname': '" + siteInfo["Title"].ToString() + "', 'partsToClone': 'apps,tabs,settings,channels,members'}";
                                        log.Info("Cloning Data : " + body);
                                        string teamResponse = Graph.cloneMicrosoftTeams(token, body, teamTemplateGroupId, log, out createdTeamSiteUrl);
                                        log.Info("Cloning Response : " + teamResponse);
                                        while (existingGroupID == "")
                                        {
                                            existingGroupID = Graph.getTeamsIdByMailNickNameName(token, siteInfo["Title"].ToString(), "", log);
                                        }
                                       
                                        if (!string.IsNullOrWhiteSpace(existingGroupID))
                                        {
                                            createdTeamSiteUrl = "https://graph.microsoft.com/v1.0/groups/" + existingGroupID;
                                                                                       
                                            // Add Owner users to newly created group
                                            var hasOwnersAdded = Graph.addUsersToTeams(token, existingGroupID, ownerUsersEmailStr, log, "owners");
                                            // Add Member users to newly created group
                                            var hasMembersAdded = Graph.addUsersToTeams(token, existingGroupID, memberUsersEmailStr, log, "members");

                                            //  Get Source SharePoint Url using existing teams id
                                            string sourceSPUrl = Graph.getSharePointSiteUrlForTeams(token, teamTemplateGroupId, log);
                                            //  Get Destination SharePoint Url using newly created teams id
                                            string destinationSPUrl = "";
                                            while (destinationSPUrl == "")
                                            {
                                                destinationSPUrl = Graph.getSharePointSiteUrlForTeams(token, existingGroupID, log);
                                            }
                                            if(sourceSPUrl!=null && sourceSPUrl!="" && destinationSPUrl!=null && destinationSPUrl != "")
                                            {
                                                // Copy content from source SharePoint site to destination SharePoint site.
                                                CloneTeamsLibrary ctlib = new CloneTeamsLibrary();
                                                ctlib.CloneLibraryItems(sourceSPUrl, destinationSPUrl, adminUserEmail, secureString);
                                            }
                                        }
                                    }
                                    else if (!string.IsNullOrWhiteSpace(ownerUsersIDString) || !string.IsNullOrWhiteSpace(memberUsersIDString))
                                    {
                                        // Create new teams
                                        string dataPost =
                                            "{ 'displayName': '" + siteInfo["Title"].ToString() + "', 'groupTypes': ['Unified'], 'mailEnabled': true, 'mailNickname': '" + siteInfo["Title"].ToString().Replace("\r\n", "").Replace(" ", "") + "', 'securityEnabled': false, 'owners@odata.bind': [" + ownerUsersIDString + "], 'visibility': 'Private','members@odata.bind':[" + memberUsersIDString + "] }";
                                        groupId = Graph.createUnifiedGroup(token, dataPost, log);
                                        log.Info("groupId: " + groupId);
                                        string dataPut = "{'memberSettings': {'allowCreateUpdateChannels': true},'messagingSettings': {'allowUserEditMessages': true,'allowUserDeleteMessages': true},'funSettings': {'allowGiphy': true,'giphyContentRating':'strict'}}";
                                        log.Info("Team JSON Data" + dataPut);
                                        string teamResponse = Graph.createMicrosoftTeams(token, dataPut, groupId, log, out createdTeamSiteUrl);
                                        //Graph.addOwnerToUnifiedGroup(token, groupId, userId);
                                        //removeOwnerToUnifiedGroup(token, groupId, userId);
                                    }
                                //siteUrl = siteInfo["ProjectSiteLink"].ToString();
                                log.Info("Teams URL : " + createdTeamSiteUrl);
                                }
                                else
                                {
                                    log.Info("Team : "+siteInfo["Title"].ToString()+ " is already exists. Please try with different name.");
                                }
                                break;
                        }
                        // When the site or Teams has been created the status of the list item will change in ready
                        if (!string.IsNullOrWhiteSpace(createdTeamSiteUrl) || !string.IsNullOrWhiteSpace(existingGroupID))
                        {
                            item["HasSiteCreated"] = true;
                            item.Update();

                            context.ExecuteQuery();
                        }
                    }
                }               
            }

            return name == null
                ? req.CreateResponse(HttpStatusCode.BadRequest, "Please pass a name on the query string or in the request body")
                : req.CreateResponse(HttpStatusCode.OK, "Hello " + adminUserEmail);
        }
    }
}
