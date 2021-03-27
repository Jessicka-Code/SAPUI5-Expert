sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/ValueState",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, ValueState, Dialog, DialogType, Button, ButtonType, Text) {
        "use strict";

        return Controller.extend("ABAP.capacitacion.controller.View1", {
            onInit: function () {
                this.onRefreshTable();
            },

            /* Obtiene registros actualizados del servidor*/
            onRefreshTable: function (x) {
                sap.ui.core.BusyIndicator.show(0);
                $.ajax({
                    url: "/srv/Customers",
                    success: function (x) {
                        var model = this.getView().getModel("localModel");
                        model.setProperty("/Clientes", x.value);
                        console.log(x);
                    }.bind(this),
                    error: function (x) {
                        sap.m.MessageToast.show("Ocurrio un error: " + x.responseText);
                        console.log(x);
                    },
                    complete: function (x) {
                        sap.ui.core.BusyIndicator.hide();
                    },
                    method: "GET"
                });
            },

            /* Botón para añadir registros */
            onAddTable: function () {
                this._getAñadirRegistroDialogo().open();
                var localModel = this.getView().getModel("localModel");
                localModel.setProperty("/nuevoRegistro", {});

            },

            _getAñadirRegistroDialogo: function () {
                if (!this._AñadirRegistroDialogo) {
                    this._AñadirRegistroDialogo = sap.ui.xmlfragment("base.project08.view.AñadirRegistroDialogo", this);
                    this.getView().addDependent(this._AñadirRegistroDialogo);
                }
                return this._AñadirRegistroDialogo;
            },

            /* Ahora van las funciones del propio diálogo */
            AñadirRegistroPress: function () {
                var oNuevoRegistro = this.getView().getModel("localModel").getProperty("/nuevoRegistro");
                var aRegistros = this.getView().getModel("localModel").getProperty("/Clientes");

                var nId = aRegistros[aRegistros.length - 1]["id"] + 1;
                oNuevoRegistro.id = nId;

                sap.ui.core.BusyIndicator.show(0);
                $.ajax({
                    headers: {
                        'Content-Type': 'application/json;IEEE754Compatible=true'
                    },
                    data: JSON.stringify(oNuevoRegistro),
                    url: "/srv/Customers",
                    success: function (x) {
                        this._getAñadirRegistroDialogo().close();
                        this.onRefreshTable();
                        console.log(x);
                    }.bind(this),
                    error: function (x) {
                        sap.m.MessageToast.show("Ocurrio un error: " + x.responseText);
                        console.log(x);
                    },
                    complete: function (x) {
                        sap.ui.core.BusyIndicator.hide();
                    },
                    method: "POST"
                });

            },

            AñadirRegistrosCancel: function () {
                this._getAñadirRegistroDialogo().close();
            },

            /* Ejecución de la eliminación */
            onDeleteTable: function (x) {
                console.log("onDeleteTable" + x);
                var oItem = x.getParameter("listItem").getBindingContext("localModel").getObject();

                sap.ui.core.BusyIndicator.show(0);
                $.ajax({
                    url: "/srv/Customers/" + oItem.id,
                    success: function (x) {

                        if (!this.oSuccessMessageDialog) {
                            this.oSuccessMessageDialog = new Dialog({
                                type: DialogType.Message,
                                title: "Success",
                                state: ValueState.Success,
                                content: new Text({ text: "El registro " + oItem.id + " fue eliminado con éxito" }),
                                beginButton: new Button({
                                    type: ButtonType.Emphasized,
                                    text: "OK",
                                    press: function () {
                                        this.onRefreshTable();
                                        this.oSuccessMessageDialog.close();
                                    }.bind(this)
                                })
                            });
                        }

                        // fix;
                        this.oSuccessMessageDialog.getContent()[0].setText("El registro " + oItem.id + " fue eliminado con éxito");
                        this.oSuccessMessageDialog.open();

                        // sap.m.MessageToast.show("El registro "+oItem.id+ " fue eliminado con éxito");
                        //var model = this.getModel("localModel");
                        //model.setProperty("/", x.value);
                        console.log(x);
                    }.bind(this),
                    error: function (x) {
                        sap.m.MessageToast.show("Ocurrio un error: " + x.responseText);
                        console.log(x);
                    },
                    complete: function (x) {
                        sap.ui.core.BusyIndicator.hide();
                    },
                    method: "DELETE"
                });
            },
            /* Ejecución de la actualización */
            limpiarObjeto: function (x) {
                return JSON.parse(JSON.stringify(x));
            },

            onUpdateTable: function (x) {
                var oRegistro = x.getSource().getBindingContext("localModel").getObject();
                oRegistro = this.limpiarObjeto(oRegistro);
                var localModel = this.getView().getModel("localModel");
                localModel.setProperty("/editarRegistro", oRegistro);
                this._getEditarRegistroDialogo().open();
                console.log("--onPress--");
            },

            _getEditarRegistroDialogo: function () {
                if (!this._EditarRegistroDialogo) {
                    this._EditarRegistroDialogo = sap.ui.xmlfragment("base.project08.view.EditarRegistroDialogo", this);
                    this.getView().addDependent(this._EditarRegistroDialogo);
                }
                return this._EditarRegistroDialogo;
            },
        });
    });
