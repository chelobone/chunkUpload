using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChunkUpload.Entidad
{
    public class Carga
    {
        public string fileHandle { get; set; }
        public string data { get; set; }
        public int startAt { get; set; }
    }
}