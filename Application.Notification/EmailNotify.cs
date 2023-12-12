using Application.Logging;
using Application.ViewModel;
using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading;

namespace Application.Notification
{
    public class EmailNotify
    {
        private IOptions<AppSettings> settings;

        public EmailNotify(IOptions<AppSettings> settings)
        {
            this.settings = settings;
        }

        public bool SendEmail(string to, string subject, string message, bool isNewThread = false)
        {
            bool isSuccess = true;
            var senderName = String.Empty;
            var senderEmail = String.Empty;
            var smtpUsername = String.Empty;
            var smtpPassword = String.Empty;
            var smtpHost = String.Empty;
            var smtpPort = String.Empty;

            // Attempt to Send Email
            senderName = this.settings.Value.SenderName;
            senderEmail = this.settings.Value.SenderEmail;
            smtpUsername = this.settings.Value.SmtpUsername;
            smtpPassword = this.settings.Value.SmtpPassword;
            smtpHost = this.settings.Value.SmtpHost;
            smtpPort = this.settings.Value.SmtpPort;

            isSuccess = DeliverEmail(senderName, senderEmail, smtpUsername, smtpPassword, smtpHost, smtpPort, to, subject, message);

            return isSuccess;
        }

        private bool DeliverEmail(string senderName, string senderEmail, string smtpUsername, string smtpPassword, string smtpHost, string smtpPort, string to, string subject, string message)
        {
            bool isSuccess = true;
            MailAddress emailFrom = new MailAddress(senderEmail, senderName);
            MailAddress emailTo = new MailAddress(to, to);
            MailMessage mail = new MailMessage(emailFrom, emailTo);

            mail.IsBodyHtml = true;
            mail.Subject = subject;
            mail.Body = message;
            mail.BodyEncoding = UTF8Encoding.UTF8;
            mail.SubjectEncoding = System.Text.Encoding.Default;
            mail.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;

            try
            {
                using (SmtpClient smtp = new SmtpClient(smtpHost, int.Parse(smtpPort)))
                {
                    smtp.EnableSsl = true;
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                    smtp.Send(mail);
                }
            }
            catch (Exception ex)
            {
                isSuccess = false;
                ErrorLog.LogError("Failed to send Email: " + ex.Message);
            }

            return isSuccess;
        }
    }
}
