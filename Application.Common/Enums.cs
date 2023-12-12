using System.ComponentModel;

namespace Application.Common
{
    public enum ERoleName
    {
        admin,
        manager,
        salesperson,
        customer        
    }

    public enum EAdStatus
    {
        Running,
        Paused,
        Sold,
        NotSold
    }

    public enum EOrderStatus
    {
        Processing,
        Completed
    }

    public enum EPaymentStatus
    {
        Pending,
        Done
    }

    public enum EOrderMode
    {
        All,
        Store,
        Online,
        PhoneOrder
    }

    public enum ESetting
    {
        CompanyName,
        CompanyAddress,
        CompanyAddress1,
        CompanyPhone,
        CompanyEmail,
        Vat,
        FooterLine1,
        FooterLine2,
        FacebookPage,
        TwitterPage,
        LinkedInPage,
        AndroidAppUrl,
        iOSAppUrl,
        RegistrationNo,
        CurrencySymbol,

        Meta_Kaywords,
        Meta_Description,
        Google_Analytics_Code,
        Stripe_SecretKey,
        Stripe_PublishKey,
        Stripe_Currency

    }

}
