export interface Credentials {
    userName: string;
    password: string;
}

export interface CredentialsResponse{
    token: string;
}

export const AuthService = {
    async login( credentials : Credentials): Promise<CredentialsResponse>{
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(credentials)
        })

        if(!response.ok){
            throw new Error('Usuário ou senha incorretos')
        }

        const data: CredentialsResponse = await response.json()
        return data;
    }
}