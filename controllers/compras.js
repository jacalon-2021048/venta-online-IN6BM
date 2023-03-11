//Desestructuracion de los objetos
const { response, request } = require('express');
const { existeProductoById } = require('../helpers/db-validators');
//Importacion de los modelos
const Compra = require('../models/compras');
const Factura = require('../models/factura');
const Producto = require('../models/producto');

//Listado de los productos en el carrito
const getCarrito = async (req = request, res = response) => {
    //Condiciones del get, devuelve los productos con disponibilidad true
    const query = { usuario: req.usuario._id, estado: true };
    //Promesa para obtener los registros
    const listaCompras = await Promise.all([
        Compra.countDocuments(query),
        Compra.find(query).populate('productos', 'nombre precio').populate('usuario', 'nombre')
            .select('-__v')
            .lean() // Necesario para que la función virtual se calcule
            .exec() // Ejecutar la consulta
    ]);

    const compras = listaCompras[1].map(compra => {
        // Calcular el campo virtual "total" para cada compra
        compra.total = compra.productos.reduce((total, producto, index) => {
            return total + producto.precio * compra.cantidadCompra[index];
        }, 0);
        return compra;
    });
    //Impresion registros
    res.status(201).json({
        total: listaCompras[0],
        msg: 'Su carrito tiene:',
        compras
    });
}

//Realiza la compra de los productos en el carrito
const getCompras = async (req = request, res = response) => {
    //Condiciones del get, devuelve los productos con disponibilidad true
    const query = { usuario: req.usuario._id, estado: true };
    //Promesa para obtener los registros
    const listaCompras = await Promise.all([
        Compra.countDocuments(query),
        Compra.find(query).populate('productos', 'nombre precio').populate('usuario', 'nombre')
            .select('-__v')
            .lean() // Necesario para que la función virtual se calcule
            .exec() // Ejecutar la consulta
    ]);

    const compras = listaCompras[1].map(compra => {
        // Calcular el campo virtual "total" para cada compra
        compra.total = compra.productos.reduce((total, producto, index) => {
            return total + producto.precio * compra.cantidadCompra[index];
        }, 0);
        return compra;
    });
    
    //Cambia el estado del carrito a false para indicar que no puede seguir añadiendo productos
    await Compra.updateMany({ usuario: req.usuario._id, estado: true }, { estado: false });
    //Verificar si hay al menos una compra antes de crear la factura
    if (compras.length > 0) {
        const nuevaFactura = new Factura({
            usuario: req.usuario._id,
            productos: compras[0].productos,
            cantidadCompra: compras[0].cantidadCompra,
            nitEmpresa: '45386792',
            total: compras[0].total
        });
        //Agrega la factura
        const facturaGuardada = await Factura(nuevaFactura);
        await facturaGuardada.save();
        //Impresion registros
        res.status(201).json({
            imp: 'Su factura se genero correctamente',
            msg: 'Su compra se ha realizado con exito',
            compras
        });
    } else {
        res.status(400).json({
            msg: 'No hay compras realizadas, por eso no se puede generar la factura'
        });
    }
}

//Mostrar el historial de compras realizado por el usuario
const getHistorialCompras = async (req = request, res = response) => {
    //Condiciones del get, devuelve los productos con disponibilidad true
    const query = { usuario: req.usuario._id };
    //Promesa para obtener los registros
    const listaCompras = await Promise.all([
        Compra.countDocuments(query),
        Compra.find(query).populate('productos', 'nombre precio').populate('usuario', 'nombre')
            .select('-__v')
            .lean() // Necesario para que la función virtual se calcule
            .exec() // Ejecutar la consulta
    ]);

    const compras = listaCompras[1].map(compra => {
        // Calcular el campo virtual "total" para cada compra
        compra.total = compra.productos.reduce((total, producto, index) => {
            return total + producto.precio * compra.cantidadCompra[index];
        }, 0);
        return compra;
    });
    //Impresion registros
    res.status(201).json({
        total: listaCompras[0],
        compras
    });
}

//Agregar un producto al carrito
const postCompra = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    const { cantidadCompra: compra } = req.body;
    const product = await existeProductoById(id);
    const cart = await Compra.find({ usuario: req.usuario._id, estado: true });
    if (compra <= product.existencias) {
        if (cart.length >= 1) {
            //Acceder al objeto de compra en el índice 0 del array
            const compraExistente = cart[0];
            if (!compraExistente.productos.includes(id)) {
                //Agrega el _id del producto al arreglo
                compraExistente.productos.push(id);
                //Agrega el numero de compras al arreglo
                compraExistente.cantidadCompra.push(compra);
                //Guarda la informacion en el carrito
                await compraExistente.save();
                //Verifica si la cantidad de compra es igual a las existencias y cambia el estado del producto a false
                if (compra == product.existencias) {
                    await Producto.updateMany({ _id: id }, { disponible: false });
                }
                //Confirmacion de agregacion al carrito
                res.status(201).json('Se agrego correctamente al carrito');
            } else {
                res.status(401).json('El producto ya esta en el carrito');
            }
        } else {
            console.log('No existe el carrito, se va a crear');
            //Generar la data a guardar
            const data = {
                usuario: req.usuario._id,
                productos: id,
                cantidadCompra: compra
            };
            //Agrega un producto al carrito
            const compraGuardada = await Compra(data);
            //Guarda el carrito
            await compraGuardada.save();
            //Modifica el modelo en produtos, restando la cantidad de compras con las existencias y suma la cantidad vendida con la cantidad de compras
            await Producto.updateMany({ _id: id }, { existencias: product.existencias - compra, cantidadVendida: product.cantidadVendida + compra });
            //Verifica si la cantidad de compra es igual a las existencias y cambia el estado del producto a false
            if (compra == product.existencias) {
                await Producto.updateMany({ _id: id }, { disponible: false });
            }
            res.status(201).json(compraGuardada);
            console.log(compraGuardada);
        }
    } else {
        res.status(409).json({ error: 'Actualmente no tenemos la cantidad deseada' });
    }
}

//Edita el producto agregado
const putCompra = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Desestructuracion de los campos a reemplazar
    const { cantidadCompra: compra } = req.body;
    const product = await existeProductoById(id);
    const cart = await Compra.find({ usuario: req.usuario._id, estado: true });
    if (compra <= product.existencias) {
        if (cart.length >= 1) {
            //Acceder al objeto de compra en el índice 0 del array
            const compraExistente = cart[0];
            if (compraExistente.productos.includes(id)) {
                //Obtenemos el indice del producto al arreglo
                let i = compraExistente.productos.indexOf(id);
                if (!(compraExistente.cantidadCompra[i] == compra)) {
                    switch (compraExistente.cantidadCompra[i] > compra) {
                        case true:
                            //Se resta la cantidad que estaba ingresada con la nueva cantidad
                            let restante = compraExistente.cantidadCompra[i] - compra;
                            //Se reemplaza la informacion solamente en el objeto del carrito obtenido
                            compraExistente.cantidadCompra[i] = compra;
                            //Guarda la informacion en el carrito
                            await compraExistente.save();
                            //Modifica el modelo en produtos, sumando lo que ya existia en existencias con el restante
                            await Producto.updateMany({ _id: id }, { existencias: product.existencias + restante });
                            res.status(201).json(compraExistente);
                            break;
                        case false:
                            //Se resta la cantidad que estaba ingresada con la nueva cantidad
                            let sumando = compra - compraExistente.cantidadCompra[i];
                            //Se reemplaza la informacion solamente en el objeto del carrito obtenido
                            compraExistente.cantidadCompra[i] = compra;
                            //Guarda la informacion en el carrito
                            await compraExistente.save();
                            //Modifica el modelo en produtos, restando lo que ya existia en existencias con el sumando
                            await Producto.updateMany({ _id: id }, { existencias: product.existencias - sumando });
                            res.status(201).json(compraExistente);
                            break;
                    }
                } else {
                    res.status(401).json({ error: 'La cantidad que ya habia comprado es igual a la nueva' });
                }
            } else {
                res.status(401).json({ error: 'El producto no se encuentra en el carrito' });
            }
        } else {
            res.status(401).json({ error: 'No puede editar el producto si no ha creado una compra primero' });
        }
    } else {
        res.status(409).json({ error: 'Actualmente no tenemos la cantidad deseada' });
    }
}

//Borrar un producto agregado
const deleteCompra = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    const cart = await Compra.find({ usuario: req.usuario._id, estado: true });

    if (cart.length >= 1) {
        //Acceder al objeto de compra en el índice 0 del array
        const compraExistente = cart[0];
        if (compraExistente.productos.includes(id)) {
            //Obtenemos el indice del producto al arreglo
            let i = compraExistente.productos.indexOf(id);
            compraExistente.productos.splice(i, 1);
            compraExistente.cantidadCompra.splice(i, 1);
            await compraExistente.save();
            res.status(200).json({ message: 'Producto eliminado correctamente' });
        } else {
            res.status(401).json({ error: 'El producto no se encuentra en el carrito' });
        }
    } else {
        res.status(401).json({ error: 'No puede eliminar el producto si no ha creado una compra primero' });
    }
}

module.exports = {
    getCompras,
    getCarrito,
    getHistorialCompras,
    postCompra,
    putCompra,
    deleteCompra
}