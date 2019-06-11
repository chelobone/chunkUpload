<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Upload.aspx.cs" Inherits="ChunkUpload.Upload" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <link rel="stylesheet" href="/Content/jqxcss/jqx.base.css" type="text/css" />
    <link rel="stylesheet" href="/Content/jqxcss/jqx.summer.css" type="text/css" />
    <script type="text/javascript" src="/Scripts/jquery-3.3.1.min.js"></script>
    <%--<script type="text/javascript" src="/Scripts/widget/jqx-all.js"></script>--%>
    <script type="text/javascript" src="/Scripts/widget/jqxcore.js"></script>
    <script type="text/javascript" src="/Scripts/widget/jqxwindow.js"></script>
    <script type="text/javascript" src="/Scripts/widget/jqxprogressbar.js"></script>
    <script type="text/javascript" src="/Scripts/chunk/chunk.js"></script>
    <script type="text/javascript" src="/Scripts/chunk/es6-promise.min.js"></script>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <div>
                <h3>Chunk Upload</h3>
                <label>Seleccione un archivo</label>
                <input type="file" id="documento" />
                <input type="button" id="btnCargar" value="Cargar documento" />


            </div>

            <div>
                <h3>Normal Upload</h3>
                <label>Seleccione un archivo</label>
                <input type="file" id="documentoNormal" />
                <input type="button" id="btnCargarNormal" value="Cargar documento" />
            </div>
        </div>

        <div id="esperando">
            <div>Cargando...</div>
            <div>
                Espere mientras se carga el contenido
                <div>
                    <label id="mensaje">Enviando datos al servidor, por favor, espere...</label>
                    <label id="actual"></label>
                    KB /<label id="total"></label>KB
                </div>
                <div>
                    <div style="margin-top: 10px; overflow: hidden;" id='progresoCargar'>
                     </div>
                </div>

            </div>
        </div>

        <div id="error">
            <div>Error al cargar</div>
            <div>
                <label id="errorMessage"></label>
            </div>
        </div>

        <div id="cargado">
            <div>Documento cargado</div>
            <div>
                <h3>
                    <label id="docID"></label>
                </h3>
                <label id="detalle"></label>
            </div>
        </div>
    </form>
</body>
</html>
