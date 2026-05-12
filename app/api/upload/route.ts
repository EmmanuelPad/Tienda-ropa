import cloudinary from "@/lib/cloudinary";
import {NextRequest} from "next/server";

export async function POST(request: Request)
{
     try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
    if (!file) 
        {
            return NextRequest.json(
                {
                 ok: false,
                    message: "No file uploaded",   
                }
            , {status: 400});
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "productos", 
                    resource_type: "image"
                }, (error, result) => 
                {
                    if (error) 
                    {
                        reject(error);
                        return;
                    } else 
                    {
                    resolve(result);
                    }
                }
            )
            .end(buffer);
        });
     }
     catch (error) 
     {
          console.error("Error al subui imagen: ", error);
          return new Response("Error uploading file", {status: 500});
     }
}