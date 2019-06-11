<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ChunkUpload._Default" %>

<asp:Content runat="server" ID="FeaturedContent" ContentPlaceHolderID="FeaturedContent">
   
</asp:Content>
<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <h3>We suggest the following:</h3>
    <div>
        <label>Seleccione un archivo</label>
        <input type="file" id="documento" />
        <input type="button" id="btnCargar" value="Cargar documento" />

        <div id="esperando">
            <div>
                Espere
            </div>
            <div>
                Espere porfavor.
            </div>
        </div>
    </div>
</asp:Content>
