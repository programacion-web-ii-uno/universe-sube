/*
GET transaction/get/?limit=20&offset=1 devuelve todas las transacciones con paginación | aca entra la magia de los filtros
Ejemplo:
GET transaction/get/?date=24-04-2025&limit=20&offset=1 |-> Devuelve todas las transacciones del dia 24/4/25
GET transaction/get/:id devuelve la transacción con la ID especifica
POST transaction/get y en el body el objeto transacción para guardar la transacción en el archivo
PUT transaction/get/:id y en el body el objeto transacción nuevo que reemplazará por completo a la transacción con el id especificado en la URL
PATCH transaction/get/:id y en el body el objeto transacción nuevo que reemplazará parcialmente a la transacción con el id especificado en la URL
DELETE transaction/get/:id borra una transacción con el ID especificado
*/
