import { NextRequest, NextResponse } from "next/server";
import { createUser, deleteuser, getUser } from "@/lib/users/user.repository";

// GET /api/admin/usuarios — devuelve todos los usuarios
export async function GET() {
  try {
    const users = await getUser();
    return NextResponse.json({ ok: true, data: users });
  } catch (error) {
    console.error("Error obteniendo los usuarios: ", error);
    return NextResponse.json(
      {
        ok: false,
        error: "No se pudieron obtener los usuarios",
      },
      {
        status: 500,
      }
    ); 
    }
}

export async function POST(request: NextRequest) {
    try 
    {
        const body = await request.json();
        const email = String(body.email??"").trim();
        const displayName = String(body.displayName??"").trim();
        const role = String(body.role??"user").trim();
        if (!email )
          {
            return NextResponse.json
            (
              {
            ok: false,
            error: "El email del usuario es requerido" 
          },
          {
            status: 400             
          }
        );
      }
      if (!displayName )
      {
        return NextResponse.json(
          {
            ok: false,
            error: "El nombre del usuario es requerido"
          },
          {
            status: 400             
          }
        );
      }
    if (role !== "user" && role !== "admin")
      {
        return NextResponse.json
        (
          {
            ok: false,
            error: "El rol del usuario no es válido"
          },
          {
            status: 400             
          }
        );
      }
      const newUser = await createUser
      (
        { 
          email, 
          displayName,
           role 
        }
      );
      return NextResponse.json
      (
        {
          ok: true,
          data: newUser
        },
        {
          status: 201
        }
       );


    }catch (error)    {
        console.error("Error creando el usuario: ", error);
        return NextResponse.json
        (
          {
            ok: false,
            error: "No se pudo crear el usuario"
          },
          {
            status: 500
          }
        );
      }
    }

export async function DELETE(request: NextRequest) {
    try 
    { 
      const { pathname } = request.nextUrl;
      const id = pathname.split("/").pop();
      if (!id) {
        return NextResponse.json(
          { ok: false, error: "ID de usuario requerido" },
          {
            status: 400
          }
        );
      }
      await deleteuser(id);
      return NextResponse.json(
        { ok: true },
        {
          status: 200
        }
      );
    } catch (error) {
      console.error("Error eliminando el usuario: ", error);
      return NextResponse.json(
        { ok: false, error: "No se pudo eliminar el usuario" },
        {
          status: 500
        }
      );
    }
  }