class UtilsClass {
    constructor() { }

    returnSchemaOption = () => {
        return {
            versionKey: false,
            timestamps: true
        }
    }

}
export const Utils = new UtilsClass();
