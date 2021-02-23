// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
        * 
        * @param {typeof sap.ui.core.mvc.Controller} Controller
    */

    function (Controller,MessageToast) {
        "use strict";

       return Controller.extend("logaligroup.SAPUI5.controller.App", {
          onInit: function(){

          },

          onOpenDialogHeader: function(){
              this.getOwnerComponent().openHelloDialog();
          }
       });
    });