using NativeMessaging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace NativeMessagingApp
{
    class Program
    {
        static public string AssemblyLoadDirectory
        {
            get
            {
                string codeBase = Assembly.GetEntryAssembly().CodeBase;
                UriBuilder uri = new UriBuilder(codeBase);
                string path = Uri.UnescapeDataString(uri.Path);
                return Path.GetDirectoryName(path);
            }
        }

        static public string AssemblyExecuteablePath
        {
            get
            {
                string codeBase = Assembly.GetEntryAssembly().CodeBase;
                UriBuilder uri = new UriBuilder(codeBase);
                return Uri.UnescapeDataString(uri.Path);
            }
        }

        static Host Host;

        static string[] AllowedOrigins = new string[] { ConfigurationManager.AppSettings["ExtentionID"] };
        static string Description = "Description Goes Here";

        static void Main(string[] args)
        {
            Host = new MyHost();
            if (args.Contains("--register"))
            {
                Host.GenerateManifest(Description, AllowedOrigins);
                Host.Register();
            }
            else if (args.Contains("--unregister"))
            {
                Host.UnRegister();
            }
            else
            {
                Host.Listen();
            }
        }
    }

    public class MyHost : Host
    {
        private const bool SendConfirmationReceipt = true;

        public override string Hostname
        {
            get { return ConfigurationManager.AppSettings["HostName"]; }
        }

        public MyHost() : base(SendConfirmationReceipt)
        {

        }

        protected override void ProcessReceivedMessage(JObject data)
        {
            System.Diagnostics.Process process = new System.Diagnostics.Process();
            System.Diagnostics.ProcessStartInfo startInfo = new System.Diagnostics.ProcessStartInfo();
            startInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Normal;
            //startInfo.WorkingDirectory = @"D:\Program Files\Autodesk\AutoCAD 2017";
            startInfo.WorkingDirectory = @ConfigurationManager.AppSettings["AutocadPath"];
            startInfo.FileName = "acad.exe";

            //startInfo.Arguments = "\"\\\\prsonal.sharepoint.com@SSL\\DavWWWRoot\\sites\\DeveloperSite\\Shared Documents\\" + model.Filename + "\"";
            startInfo.Arguments = "\""+data["text"].Value<string>() + "\"";
            Utils.LogMessage("arg : " + startInfo.Arguments);
            process.StartInfo = startInfo;
            process.Start();
            var response = JObject.FromObject(new { response = "Opened" });
           // Newtonsoft.Json.JsonConvert.DeserializeObject()
            SendMessage(response);
            //Environment.Exit(0);

        }
    }
}
