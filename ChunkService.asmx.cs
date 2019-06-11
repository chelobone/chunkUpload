using ChunkUpload.Entidad;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.Services.Protocols;

namespace ServicioChunk
{
    /// <summary>
    /// Summary description for ChunkService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class ChunkService : System.Web.Services.WebService
    {
        [ScriptMethod(ResponseFormat = ResponseFormat.Json), WebMethod]
        public string HelloWorld(string formato)
        {

            Thread.Sleep(5000);
            return new JavaScriptSerializer().Serialize("Hello World");
        }

        /// <summary>
        /// /Método que permite realizar carga normal de documentos al servidor
        /// </summary>
        /// <param name="carga"></param>
        /// <param name="nombre"></param>
        /// <returns></returns>
        [ScriptMethod(ResponseFormat = ResponseFormat.Json), WebMethod]
        public int CargaNormal(Carga carga, string nombre)
        {
            int number = 0;
            carga.fileHandle = new Random().Next(100).ToString();
            FileStream fs1 = new FileStream(Path.GetTempPath() + "FileUpload\\_part" + carga.fileHandle + ".dat", FileMode.CreateNew);
            fs1.Close();

            byte[] data = Convert.FromBase64String(carga.data.Split(',')[1]);
            FileInfo fi = new FileInfo(Path.GetTempPath() + "FileUpload\\_part" + carga.fileHandle + ".dat");

            // Realizar validación
            if (!fi.Exists)
            {

                // Manejamos cuando la validación falle
            }
            else
            {

                // Escribir el archivo en disco
                using (FileStream fs = new FileStream(fi.FullName, FileMode.Append))
                    fs.Write(data, 0, data.Length);

                FileInfo targetFile = new FileInfo(Path.GetTempPath() + "FileUpload\\_part" + carga.fileHandle + ".dat");
                if (targetFile.Exists)
                {
                    var docNumber = 1;
                    if (docNumber > 0)
                    {
                        number = docNumber;
                        targetFile.Delete();
                    }
                }
            }

            return number;
        }

        /// <summary>
        /// Método que inicia el proceso de la carga chunk
        /// </summary>
        /// <returns></returns>
        [ScriptMethod(ResponseFormat = ResponseFormat.Json), WebMethod]
        public string BeginUploadFile()
        {
            // Ahora, crearemos un archivo temporal en el directorio
            // El nombre del archivo será de la siguiente forma: _partNNN.dat, donde NNN es un número de tres digitos
            // Este numero será retornado como fileHandle

            DirectoryInfo dir = new DirectoryInfo(Path.GetTempPath() + "FileUpload");
            if (!dir.Exists)
                dir.Create();
            Random rnd = new Random();
            int n = 0;
            string name = null;

            do
            {
                n = rnd.Next(1000);
                name = string.Format("_part{0:000}.dat", n);
            }
            while (dir.GetFiles(name).Length > 0);

            // En este punto, hemos obtenido el nombre unico identificado como n

            FileStream fs = new FileStream(dir.FullName + "\\" + name, FileMode.CreateNew);
            fs.Close();

            // Ya hemos creado el archivo de tamaño 0, que representa el archivo por el lado del servidor

            // Finalmente, lo retornamos a quién llama la función
            return n.ToString("000");

        }

        /// <summary>
        /// Método que permite continuar la carga chunk, recibiendo los parámetros que permiten completar el archivo
        /// </summary>
        /// <param name="carga"></param>
        [ScriptMethod(ResponseFormat = ResponseFormat.Json), WebMethod]
        [SoapDocumentMethod(OneWay = true)]
        public void UploadChunk(Carga carga)
        {

            byte[] data = Convert.FromBase64String(carga.data);
            FileInfo fi = new FileInfo(Path.GetTempPath() + "FileUpload\\_part" + carga.fileHandle + ".dat");

            // Realizar validación
            if (!fi.Exists)
            {
                // Hacer lo que se deba hacer cuando la carga falle
            }
            else
            {
                // Si la validación es exitosa, 
                using (FileStream fs = new FileStream(fi.FullName, FileMode.Append))
                {
                    for (int i = 0; i < data.Length; i++)
                    {
                        fs.WriteByte(data[i]);
                    }
                }

            }
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json), WebMethod]
        public long GetStatus(string fileHandle)
        {
            FileInfo fi = new FileInfo(Path.GetTempPath() + "FileUpload\\_part" + fileHandle + ".dat");
            long pos = (fi.Exists ? fi.Length : 0);
            return pos;
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json), WebMethod]
        public int EndUploadFile(string fileHandle, string nombre, bool quitUpload)
        {
            int number = 0;
            try
            {
                FileInfo fi = new FileInfo(Path.GetTempPath() + "FileUpload\\_part" + fileHandle + ".dat");

                // Validar el archivo
                if (!fi.Exists)
                    throw new System.ArgumentException("Archivo temporal no Existe {0}", Path.GetTempPath());

                if (quitUpload)
                {
                    fi.Delete();
                }
                else
                {
                    FileInfo targetFile = new FileInfo(Path.GetTempPath() + "FileUpload\\_part" + fileHandle + ".dat");
                    if (targetFile.Exists)
                    {
                        //Acá cargamos/movemos/copiamos el documento y asignamos un valor a docNumber
                        //Esto indica que ya procesamos el documento, por lo que podemos eliminar el archivo temporal
                        var docNumber = 1;
                        if (docNumber > 0)
                        {
                            number = docNumber;
                            targetFile.Delete();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(string.Format("Error al finalizar la carga del archivo {0}, ruta temporal: {1}", ex.ToString(), Path.GetTempPath()));
            }
            return number;
        }
    }
}
