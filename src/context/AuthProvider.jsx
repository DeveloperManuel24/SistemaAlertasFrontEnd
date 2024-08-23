//Aqui es donde nace todo el estado global de la aplicacion 
import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/axios";

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [cargando,setCargando] = useState(true)
    const [auth, setAuth] = useState({})//Si este objeto esta lleno con la informacion que viene desde la API, significa que el usuario esta autenticado

    //Cuando Carge la APP revisa si el usuario esta autenticado
    useEffect(() => {
        const autenticarUsuario = async () => {
            //Revisamos el token JWT
            const token = localStorage.getItem('token')
            
            if(!token) {//en caso de que no este el token, de igual forma vamos a mandar un cargando false(no te ahueves, creo que esto esta solo porque siempre hay que cargar)
                setCargando(false)
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const {data} = await clienteAxios.get('/veterinarios/perfil',
                config)
                setAuth(data)//Lo enviamos al useState global
            } catch (error) {
                console.log(error.response.data.msg);
                setAuth({})
            }
            setCargando(false)//Esta onda solo es que esta cargando 
        }
        autenticarUsuario()
    },[])

    const cerrarSesion = () => {
        localStorage.removeItem('token')
        setAuth({})
    }

    const actualizarPerfil = async  datos => {

        const token = localStorage.getItem('token')
        if(!token) {//en caso de que no este el token, de igual forma vamos a mandar un cargando false(no te ahueves, creo que esto esta solo porque siempre hay que cargar)
            setCargando(false)
            return
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const url = `/veterinarios/perfil/${datos._id}`
            const {data} = await clienteAxios.put(url,datos, config)
           
            return {
                msg: 'Almacenado Correctamente'
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }
    }

    const guardarPassword = async datos => {
        const token = localStorage.getItem('token')
            
            if(!token) {//en caso de que no este el token, de igual forma vamos a mandar un cargando false(no te ahueves, creo que esto esta solo porque siempre hay que cargar)
                setCargando(false)
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const url = `/veterinarios/actualizar-password`
                const {data} = await clienteAxios.put(url,datos,config)
                console.log(data)
                return{
                    msg: data.msg
                }
            } catch (error) {
                return{
                    msg: error.response.data.msg,
                    error:true
                }
            }
    }
    return(
        <AuthContext.Provider
          value={{
            auth,
            setAuth,
            cargando,
            cerrarSesion,
            actualizarPerfil,
            guardarPassword
          }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext