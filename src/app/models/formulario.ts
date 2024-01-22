export interface Formulario {
    id: number
    nombreFormulario: string
    googleFormId: string
    spreadsheetId: string
    sheetName: string
    endPointEditLinks: string
    configGoogleForm: ConfigGoogleForm
}

export interface ConfigGoogleForm {
    id: number
    type: string
    projectId: string
    privateKeyId: string
    privateKey: string
    clientEmail: string
    clientId: string
    authUri: string
    tokenUri: string
    authProviderX509CertUrl: string
    clientX509CertUrl: string
    universeDomain: string
}