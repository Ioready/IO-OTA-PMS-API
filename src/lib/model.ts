class ModelClass {
    constructor() { }

    returnText = (value: String) => {
        switch (value) {
            // case "phone.national_number":
            //     return "Mobile number";
            // case "phone.country_code":
            //     return "Country code";
            case "otp":
                return "OTP";
            default:
                return (value.charAt(0).toUpperCase() + value.slice(1)).replace("_", " ");
        }
    }

}
export const Model = new ModelClass();


