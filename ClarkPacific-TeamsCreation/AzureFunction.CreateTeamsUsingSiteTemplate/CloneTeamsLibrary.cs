using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace AzureFunction.CreateTeamsUsingSiteTemplate
{
    class CloneTeamsLibrary
    {
        public void CloneLibraryItems(string srcUrl,string destUrl, string userName, SecureString securedPassword)
        {
            string srcLibrary = "Documents";
            string srclibraryname = string.Empty;
            string fileName = string.Empty;
            string folderPath = string.Empty;
            try
            {

                ClientContext srcContext = new ClientContext(srcUrl);
                ClientContext destContext = new ClientContext(destUrl);

                srcContext.Credentials = new SharePointOnlineCredentials(userName, securedPassword);
                srcContext.Load(srcContext.Site.RootWeb);

                // srcContext.RequestTimeout = Timeout.Infinite;
                Web srcWeb = srcContext.Web;
                List srcList = srcWeb.Lists.GetByTitle(srcLibrary);
                CamlQuery camlQuery = new CamlQuery();
                camlQuery.ViewXml = "<View Scope ='RecursiveAll'></View>";
                ListItemCollection itemColl = srcList.GetItems(camlQuery);
                srcContext.Load(itemColl);
                srcContext.ExecuteQuery();

                destContext.Credentials = new SharePointOnlineCredentials(userName, securedPassword);
                destContext.Load(destContext.Site.RootWeb);

                //  destContext.RequestTimeout = Timeout.Infinite;
                Web destWeb = destContext.Web;
                destContext.Load(destWeb);
                destContext.ExecuteQuery();

                string _path = destWeb.ServerRelativeUrl;
                if (itemColl.Count > 0)
                {
                    srclibraryname = itemColl[0].FieldValues["FileDirRef"].ToString();
                    string[] srcurlSplit = srclibraryname.Split('/');
                    srclibraryname = srcurlSplit[srcurlSplit.Count() - 1];

                    foreach (ListItem doc in itemColl)
                    {
                        if (doc.FileSystemObjectType == FileSystemObjectType.File)
                        {
                            fileName = doc["FileRef"].ToString();
                            string[] fileNames = fileName.Split(new string[] { srclibraryname }, StringSplitOptions.None);
                            fileName = fileNames[fileNames.Count() - 1];

                            File file = doc.File;
                            srcContext.Load(file);
                            srcContext.ExecuteQuery();

                            FileInformation fileInfo = File.OpenBinaryDirect(srcContext, file.ServerRelativeUrl);
                            File.SaveBinaryDirect(destContext, _path + "/" + srclibraryname + fileName, fileInfo.Stream, true);

                        }
                        else if (doc.FileSystemObjectType == FileSystemObjectType.Folder)
                        {
                            folderPath = doc["FileRef"].ToString();
                            string[] fileNames = folderPath.Split(new string[] { srclibraryname }, StringSplitOptions.None);
                            folderPath = fileNames[fileNames.Count() - 1];
                            folderPath = folderPath.TrimStart(new Char[] { '/' });
                            //Console.WriteLine("Folder Path :" + folderPath);
                            Folder folder = CreateFolder(destContext.Web, srcLibrary, folderPath);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
        public Folder CreateFolder(Web web, string listTitle, string fullFolderPath)
        {
            if (string.IsNullOrEmpty(fullFolderPath))
                throw new ArgumentNullException("fullFolderPath");
            var list = web.Lists.GetByTitle(listTitle);
            return CreateFolderInternal(web, list.RootFolder, fullFolderPath);
        }

        private Folder CreateFolderInternal(Web web, Folder parentFolder, string fullFolderPath)
        {
            var folderUrls = fullFolderPath.Split(new char[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
            string folderUrl = folderUrls[0];
            var curFolder = parentFolder.Folders.Add(folderUrl);
            web.Context.Load(curFolder);
            web.Context.ExecuteQuery();
            if (folderUrls.Length > 1)
            {
                var folderPath = string.Join("/", folderUrls, 1, folderUrls.Length - 1);
                return CreateFolderInternal(web, curFolder, folderPath);
            }
            return curFolder;
        }
    }
}
