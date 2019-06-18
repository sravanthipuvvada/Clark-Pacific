using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using System.Web.Script.Serialization;
using Newtonsoft.Json.Linq;

namespace AzureFunction.CreateTeamsUsingSiteTemplate
{
    public class Graph
    {
        public static string getToken(TraceWriter log)
        {
            string endPoint = Environment.GetEnvironmentVariable("createTeamsTokenEndpoint");
            if (string.IsNullOrWhiteSpace(endPoint))
                endPoint = "https://login.microsoftonline.com/b02f19e1-7923-4d3b-86b2-bf294cfa305d/oauth2/v2.0/token";
            log.Info("Token EndPoint : " + endPoint);
            string clientID = Environment.GetEnvironmentVariable("createTeamsClientId");
            if (string.IsNullOrWhiteSpace(clientID))
                clientID = "3ad91390-f17b-4130-9f14-6087aa533ef4";
            log.Info("Client ID : " + clientID);
            string clientSecret = Environment.GetEnvironmentVariable("createTeamsClientSecret");
            if (string.IsNullOrWhiteSpace(clientSecret))
                clientSecret = "GqioqtlDMJ0H/r?5FNLA5rps]e5?uhW8";
            log.Info("client Secret : " + clientSecret);
            string data = "grant_type=client_credentials&client_id=" + clientID +
                "&client_secret=" + clientSecret + "&scope=https://graph.microsoft.com/.default"; //    resource=https://graph.microsoft.com";
            string contenType = "application/x-www-form-urlencoded";

            log.Info("Data for GetToken : " + data);
            string responseFromServer = requestGetToken(endPoint, data, log, contenType);
            AccessToken accessToken = JsonConvert.DeserializeObject<AccessToken>(responseFromServer);

            return accessToken.access_token;
        }

        public static string createMicrosoftTeams(string token, string data, string groupId, TraceWriter log, out string createdTeamSiteUrl)
        {

            string endPoint = "https://graph.microsoft.com/v1.0/groups/" + groupId + "/team";
            string contenType = "application/json";
            string responseFromServer = requestPut(token, endPoint, data, log, contenType);
            var response = JsonConvert.DeserializeObject<GraphGroup>(responseFromServer);
            createdTeamSiteUrl = "https://graph.microsoft.com/v1.0/groups/" + response;
            return response.ToString();
        }
        public static string cloneMicrosoftTeams(string token, string data, string groupId, TraceWriter log, out string createdTeamSiteUrl)
        {
            var endPoint = "https://graph.microsoft.com/v1.0/teams/" + groupId + "/clone";
            //var endPoint = "https://graph.microsoft.com/v1.0/teams/" + groupId + "/microsoft.graph.clone";
            log.Info("Cloning EndPoints : " + endPoint);
            string contenType = "application/json";
            string responseFromServer = requestPost(token, endPoint, data, log, contenType);
            log.Info("Response : " + responseFromServer);
            var response = JsonConvert.DeserializeObject<GraphGroup>(responseFromServer != null ? responseFromServer : "");
            // log.Info("Cloning DeserializeObject Response : " + response);
            createdTeamSiteUrl = "https://graph.microsoft.com/v1.0/groups/" + response;
            return response != null ? response.ToString() : "";
        }
        public static string getUser(string token, string userPrincipalName, TraceWriter log)
        {
            string endPoint = "https://graph.microsoft.com/v1.0/users/" + userPrincipalName + "?$select=id";
            string responseFromServer = requestGet(endPoint, token, log);
            GraphUser graphUser = JsonConvert.DeserializeObject<GraphUser>(responseFromServer);

            return graphUser.id;
        }

        public static List<string> getGroupUserID(string token, string groupID, TraceWriter log, string userType)
        {
            List<string> ownerUserIDArray = new List<string>();
            string endPoint = "https://graph.microsoft.com/v1.0/groups/" + groupID + "/" + userType;
            string responseFromServer = requestGet(endPoint, token, log);
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            dynamic item = serializer.Deserialize<object>(responseFromServer);
            if (item != null && item["value"] != null)
            {
                foreach (var result in item["value"])
                {
                    if (result != null && result["id"] != null)
                    {
                        string id = (string)result["id"];
                        ownerUserIDArray.Add(id);
                    }
                }
            }
            return ownerUserIDArray;
        }
        public static string getSharePointSiteUrlForTeams(string token, string groupID, TraceWriter log)
        {
            string spSiteUrl = "";
            string endPoint = "https://graph.microsoft.com/v1.0/groups/" + groupID + "/sites/root/weburl";
            string responseFromServer = requestGet(endPoint, token, log);

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            dynamic item = serializer.Deserialize<object>(responseFromServer);
            if (item != null && item["value"] != null)
            {
                spSiteUrl = item["value"];
            }
            return spSiteUrl;
        }
        public static string createUnifiedGroup(string token, string data, TraceWriter log)
        {
            string endPoint = "https://graph.microsoft.com/v1.0/groups/";
            string contenType = "application/json";
            string responseFromServer = requestPost(token, endPoint, data, log, contenType);
            GraphGroup group = JsonConvert.DeserializeObject<GraphGroup>(responseFromServer);

            return group.id;
        }

        public static string getTeamsIdByMailNickNameName(string token, string teamsDisplayName, string data, TraceWriter log)
        {
            var groupId = "";
            if (teamsDisplayName != null && teamsDisplayName != "")
            {
                teamsDisplayName = teamsDisplayName.Replace(" ", string.Empty).Trim();
                string endPoint = "https://graph.microsoft.com/v1.0/groups?$select=id&$filter=mailNickname eq '" + teamsDisplayName + "'";
                log.Info("Checking if Teams : " + teamsDisplayName + " already exists or not.");
                string contenType = "application/json";
                string responseFromServer = requestGet(endPoint, token, log);
                log.Info("Response from GET Request : " + responseFromServer != null ? responseFromServer : "");
                if (responseFromServer.IndexOf("\"id\":") > 0)
                {
                    JavaScriptSerializer serializer = new JavaScriptSerializer();
                    dynamic item = serializer.Deserialize<object>(responseFromServer);
                    if (item != null && item["value"] != null && item["value"][0] != null && item["value"][0]["id"] != null)
                        groupId = item["value"][0]["id"];
                }
            }
            return groupId;
        }
        public static string FormatUserIdFromUserEmail(string token, string users, TraceWriter log)
        {
            string ownerUserString = "";
            if ((token != null && token != "") && (users != null && users != ""))
            {
                string[] owners = users.Split(';');
                foreach (string useremail in owners)
                {
                    if (useremail != null && !string.IsNullOrWhiteSpace(useremail))
                    {
                        var userId = Graph.getUser(token, useremail, log);
                        if (userId != null && !string.IsNullOrWhiteSpace(userId))
                        {
                            log.Info("userId: " + userId);
                            // ownerUserString += "https://graph.microsoft.com/v1.0/users/" + userId + ",";
                            ownerUserString += '"' + "https://graph.microsoft.com/v1.0/users/" + userId + '"' + ',';
                        }
                    }
                }
            }
            if (ownerUserString.Length > 0)
                ownerUserString = ownerUserString.Substring(0, ownerUserString.Length - 1);
            return ownerUserString;
        }

        public static bool addFormUsersToTeams(string token, string groupId, string userIdCollection, TraceWriter log, string userType)
        {
            bool hasUserAdded = false;
            if (userIdCollection != null && userIdCollection != "")
            {
                List<string> ownersIDArray = Graph.getGroupUserID(token, groupId, log, userType);
                string[] owners = userIdCollection.Split(';');
                foreach (string useremail in owners)
                {
                    if (useremail != null && !string.IsNullOrWhiteSpace(useremail))
                    {
                        var userId = Graph.getUser(token, useremail, log);
                        if (userId != null && !string.IsNullOrWhiteSpace(userId))
                        {
                            if (ownersIDArray.IndexOf(userId) < 0)
                            {
                                log.Info("Adding User : " + useremail + "-" + userId);
                                hasUserAdded = Graph.addUsersToUnifiedGroup(token, groupId, userId, log, userType);
                                log.Info("Added User : " + useremail);
                                ownersIDArray = Graph.getGroupUserID(token, groupId, log, userType);
                            }
                        }
                    }
                }
            }
            return hasUserAdded;
        }

        public static bool addDefaultTeamsUserToNewTeams(string token, string defaultTeamsGroupId, string newTeamsGroupId, TraceWriter log, string userType)
        {
            bool hasUserAdded = false;
            List<string> defaultOwnersIDArray = Graph.getGroupUserID(token, defaultTeamsGroupId, log, userType);
            List<string> newOwnersIDArray = Graph.getGroupUserID(token, newTeamsGroupId, log, userType);

            foreach (string userId in defaultOwnersIDArray.ToArray())
            {
                if (userId != null && !string.IsNullOrWhiteSpace(userId))
                {
                    if (newOwnersIDArray.IndexOf(userId) < 0)
                    {
                        hasUserAdded = Graph.addUsersToUnifiedGroup(token, newTeamsGroupId, userId, log, userType);
                        newOwnersIDArray = Graph.getGroupUserID(token, newTeamsGroupId, log, userType);
                    }                    
                }
            }
            return hasUserAdded;
        }
        public static bool addUsersToUnifiedGroup(string token, string groupId, string userId, TraceWriter log, string userType)
        {
            bool ownerAdded = false;

            string endPoint = "https://graph.microsoft.com/v1.0/groups/" + groupId + "/" + userType + "/$ref";

            string data = "{ '@odata.id': 'https://graph.microsoft.com/v1.0/users/" + userId + "' }";
            log.Info("Adding User To Unified Group: " + endPoint + "-" + data);
            string contenType = "application/json";
            log.Info("Calling POST to add users to Unified Group: " + endPoint + "-" + data);
            string responseFromServer = requestPost(token, endPoint, data, log, contenType);
            log.Info("Added users to Unified Group: " + endPoint + "-" + data);
            ownerAdded = true;

            return ownerAdded;
        }
        public static bool addOwnerToUnifiedGroup(string token, string groupId, string userId, TraceWriter log)
        {
            bool ownerAdded = false;

            string endPoint = "https://graph.microsoft.com/v1.0/groups/" + groupId + "/owners/$ref";

            string data = "{ '@odata.id': 'https://graph.microsoft.com/v1.0/users/" + userId + "' }";
            string contenType = "application/json";
            string responseFromServer = requestPost(token, endPoint, data, log, contenType);
            ownerAdded = true;

            return ownerAdded;
        }

        public static bool addMembersToUnifiedGroup(string token, string groupId, string userId, TraceWriter log)
        {
            bool memberAdded = false;
            string endPoint = "https://graph.microsoft.com/v1.0/groups/" + groupId + "/members/$ref";

            string data = "{ '@odata.id': 'https://graph.microsoft.com/v1.0/users/" + userId + "' }";
            string contenType = "application/json";
            string responseFromServer = requestPost(token, endPoint, data, log, contenType);
            memberAdded = true;

            return memberAdded;
        }

        public static bool removeOwnerToUnifiedGroup(string token, string groupId, string userId)
        {
            bool ownerRemoved = false;
            string endPoint = "https://graph.microsoft.com/v1.0/groups/" + groupId + "/owners/" + userId + "/$ref";
            string data = "";
            string contenType = "application/json";
            string responseFromServer = requestDelete(token, endPoint, data, contenType);
            ownerRemoved = true;

            return ownerRemoved;
        }

        private static string requestGetToken(string endPoint, string postData, TraceWriter log, string contentType = null)
        {
            string responseFromServer = "";
            try
            {
                // Create a request using a URL that can receive a post.   
                WebRequest request = WebRequest.Create(endPoint);
                // Set the Method property of the request to POST.  
                request.Method = "POST";
                // Create POST data and convert it to a byte array.  
                byte[] byteArray = Encoding.UTF8.GetBytes(postData);
                if (string.IsNullOrEmpty(contentType) == false)
                {
                    // Set the ContentType property of the WebRequest.  
                    request.ContentType = contentType;
                }
                // Set the ContentLength property of the WebRequest.  
                request.ContentLength = byteArray.Length;
                // Get the request stream.  
                Stream dataStream = request.GetRequestStream();
                // Write the data to the request stream.  
                dataStream.Write(byteArray, 0, byteArray.Length);
                // Close the Stream object.  
                dataStream.Close();
                log.Info("Data stream read - done.");
                // Get the response.  
                log.Info("Calling WebResponse - GetResponse");
                WebResponse response = request.GetResponse();
                log.Info("Received WebResponse");
                // Display the status.  
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                // Get the stream containing content returned by the server.  
                dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.  
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.  
                responseFromServer = reader.ReadToEnd();

                // Clean up the streams.  
                reader.Close();
                dataStream.Close();
                response.Close();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            log.Info("Returned Token : " + responseFromServer);
            return responseFromServer;
        }

        private static string requestGet(string endPoint, string token, TraceWriter log, string postData = null, string contentType = null)
        {
            string responseFromServer = string.Empty;
            try
            {
                log.Info("Creating GET request.");
                // Create a request for the URL.   
                WebRequest request = WebRequest.Create(endPoint);
                log.Info("Created GET request.");
                // If required by the server, set the credentials.  
                //request.Credentials = CredentialCache.DefaultCredentials;
                request.Headers.Add("Authorization", "Bearer " + token);
                // Get the response.  
                log.Info("Creating Web response.");
                WebResponse response = request.GetResponse();
                log.Info("Created Web response.");
                // Display the status.  
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                // Get the stream containing content returned by the server.  
                Stream dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.  
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.  
                responseFromServer = reader.ReadToEnd();
                // Display the content.  
                Console.WriteLine(responseFromServer);
                // Clean up the streams and the response.  
                reader.Close();
                response.Close();
                log.Info("GET response : " + responseFromServer);
            }
            catch (Exception ex)
            {
                log.Info("Exception for EndPoints : " + endPoint + "-" + ex.Message != null ? ex.Message : "-" + ex.StackTrace != null ? ex.StackTrace : "");
            }
            return responseFromServer;
        }

        private static string requestPost(string token, string endPoint, string postData, TraceWriter log, string contentType = null)
        {
            string responseFromServer = string.Empty;
            try
            {
                log.Info("Creating POST request...");
                // Create a request using a URL that can receive a post.   
                WebRequest request = WebRequest.Create(endPoint);
                log.Info("Created POST request.");
                // Set the Method property of the request to POST.  
                request.Method = "POST";
                // Create POST data and convert it to a byte array.  
                byte[] byteArray = Encoding.UTF8.GetBytes(postData);
                request.Headers.Add("Authorization", "Bearer " + token);
                if (string.IsNullOrEmpty(contentType) == false)
                {
                    // Set the ContentType property of the WebRequest.  
                    request.ContentType = contentType;
                }
                // Set the ContentLength property of the WebRequest.  
                request.ContentLength = byteArray.Length;
                // Get the request stream.  
                Stream dataStream = request.GetRequestStream();
                // Write the data to the request stream.  
                dataStream.Write(byteArray, 0, byteArray.Length);
                // Close the Stream object.  
                dataStream.Close();
                // Get the response.  
                WebResponse response = request.GetResponse();
                // Display the status.  
                log.Info("Calling Web Response - GetResponse method");
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                log.Info("Called Web Response - " + ((HttpWebResponse)response).StatusDescription);
                // Get the stream containing content returned by the server.  
                dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.  
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.  
                responseFromServer = reader.ReadToEnd();

                // Clean up the streams.  
                reader.Close();
                dataStream.Close();
                response.Close();
                log.Info("Reader Response : " + responseFromServer);
            }
            catch (Exception ex)
            {
                log.Info("Exception for EndPoints : " + endPoint + "-" + ex.Message != null ? ex.Message : "-" + ex.StackTrace != null ? ex.StackTrace : "");
            }
            return responseFromServer;
        }

        private static string requestPut(string token, string endPoint, string postData, TraceWriter log, string contentType = null)
        {
            string responseFromServer = string.Empty;
            try
            {
                log.Info("Creating PUT request.");
                // Create a request using a URL that can receive a post.   
                WebRequest request = WebRequest.Create(endPoint);
                // Set the Method property of the request to POST.  
                request.Method = "PUT";
                // Create POST data and convert it to a byte array.  
                byte[] byteArray = Encoding.UTF8.GetBytes(postData);
                request.Headers.Add("Authorization", "Bearer " + token);
                if (string.IsNullOrEmpty(contentType) == false)
                {
                    // Set the ContentType property of the WebRequest.  
                    request.ContentType = contentType;
                }
                // Set the ContentLength property of the WebRequest.  
                request.ContentLength = byteArray.Length;
                // Get the request stream.  
                Stream dataStream = request.GetRequestStream();
                // Write the data to the request stream.  
                dataStream.Write(byteArray, 0, byteArray.Length);
                // Close the Stream object.  
                dataStream.Close();
                // Get the response.             
                WebResponse response = request.GetResponse();
                // Display the status.              
                // Get the stream containing content returned by the server.  
                dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.  
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.  
                responseFromServer = reader.ReadToEnd();

                // Clean up the streams.  
                reader.Close();
                dataStream.Close();
                response.Close();
            }
            catch (Exception ex)
            {
                log.Info("Exception for EndPoints : " + endPoint + "-" + ex.Message != null ? ex.Message : "-" + ex.StackTrace != null ? ex.StackTrace : "");
            }
            return responseFromServer;
        }


        private static string requestDelete(string token, string endPoint, string postData, string contentType = null)
        {
            // Create a request using a URL that can receive a post.   
            WebRequest request = WebRequest.Create(endPoint);
            // Set the Method property of the request to POST.  
            request.Method = "DELETE";
            // Create POST data and convert it to a byte array.  
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            request.Headers.Add("Authorization", "Bearer " + token);
            if (string.IsNullOrEmpty(contentType) == false)
            {
                // Set the ContentType property of the WebRequest.  
                request.ContentType = contentType;
            }
            // Set the ContentLength property of the WebRequest.  
            request.ContentLength = byteArray.Length;
            // Get the request stream.  
            Stream dataStream = request.GetRequestStream();
            // Write the data to the request stream.  
            dataStream.Write(byteArray, 0, byteArray.Length);
            // Close the Stream object.  
            dataStream.Close();
            // Get the response.  
            WebResponse response = request.GetResponse();
            // Display the status.  
            Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.  
            dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.  
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.  
            string responseFromServer = reader.ReadToEnd();

            // Clean up the streams.  
            reader.Close();
            dataStream.Close();
            response.Close();
            return responseFromServer;
        }

        public class AccessToken
        {
            public String token_type { get; set; }
            public String resource { get; set; }
            public String access_token { get; set; }
            public String expires_in { get; set; }
            public String ext_expires_in { get; set; }
            public String expires_on { get; set; }
            public String not_before { get; set; }
        }

        public class GraphGroup
        {
            public String id { get; set; }
        }

        public class GraphUser
        {
            public String id { get; set; }
        }
    }
}
