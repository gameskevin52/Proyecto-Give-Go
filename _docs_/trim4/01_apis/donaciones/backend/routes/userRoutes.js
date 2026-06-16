
/**

* @swagger
* components:
* schemas:
*
* ```
  User:
  ```
* ```
    type: object
  ```
* ```
    properties:
  ```
* ```
      id:
  ```
* ```
        type: integer
  ```
* ```
        description: ID del usuario
  ```
* ```
      email:
  ```
* ```
        type: string
  ```
* ```
        format: email
  ```
* ```
        description: Correo electrónico
  ```
* ```
      name:
  ```
* ```
        type: string
  ```
* ```
        description: Primer nombre
  ```
* ```
      second_name:
  ```
* ```
        type: string
  ```
* ```
        nullable: true
  ```
* ```
        description: Segundo nombre
  ```
* ```
      lastname:
  ```
* ```
        type: string
  ```
* ```
        description: Primer apellido
  ```
* ```
      second_lastname:
  ```
* ```
        type: string
  ```
* ```
        nullable: true
  ```
* ```
        description: Segundo apellido
  ```
* ```
      phone:
  ```
* ```
        type: string
  ```
* ```
        description: Número telefónico
  ```
* ```
      role:
  ```
* ```
        type: string
  ```
* ```
        enum:
  ```
* ```
          - Admin
  ```
* ```
          - Voluntario
  ```
* ```
          - Beneficiario
  ```
*
* ```
  Login:
  ```
* ```
    type: object
  ```
* ```
    required:
  ```
* ```
      - email
  ```
* ```
      - password
  ```
* ```
    properties:
  ```
* ```
      email:
  ```
* ```
        type: string
  ```
* ```
        format: email
  ```
* ```
      password:
  ```
* ```
        type: string
  ```
* ```
        format: password
  ```
* ```
    example:
  ```
* ```
      email: "juan.castro@email.com"
  ```
* ```
      password: "123456"
  ```
*
* ```
  CreateUser:
  ```
* ```
    type: object
  ```
* ```
    required:
  ```
* ```
      - name
  ```
* ```
      - lastname
  ```
* ```
      - email
  ```
* ```
      - password
  ```
* ```
      - phone
  ```
* ```
    properties:
  ```
* ```
      name:
  ```
* ```
        type: string
  ```
* ```
      second_name:
  ```
* ```
        type: string
  ```
* ```
      lastname:
  ```
* ```
        type: string
  ```
* ```
      second_lastname:
  ```
* ```
        type: string
  ```
* ```
      phone:
  ```
* ```
        type: string
  ```
* ```
      email:
  ```
* ```
        type: string
  ```
* ```
        format: email
  ```
* ```
      password:
  ```
* ```
        type: string
  ```
* ```
        format: password
  ```
* ```
      role:
  ```
* ```
        type: string
  ```
* ```
        enum:
  ```
* ```
          - Admin
  ```
* ```
          - Voluntario
  ```
* ```
          - Beneficiario
  ```
* ```
    example:
  ```
* ```
      name: "Juan"
  ```
* ```
      second_name: "David"
  ```
* ```
      lastname: "Castro"
  ```
* ```
      second_lastname: "Perez"
  ```
* ```
      phone: "3204567890"
  ```
* ```
      email: "juan.castro@email.com"
  ```
* ```
      password: "123456"
  ```
* ```
      role: "Voluntario"
  ```
*
* ```
  UpdateUser:
  ```
* ```
    type: object
  ```
* ```
    properties:
  ```
* ```
      id:
  ```
* ```
        type: integer
  ```
* ```
      name:
  ```
* ```
        type: string
  ```
* ```
      second_name:
  ```
* ```
        type: string
  ```
* ```
      lastname:
  ```
* ```
        type: string
  ```
* ```
      second_lastname:
  ```
* ```
        type: string
  ```
* ```
      phone:
  ```
* ```
        type: string
  ```
* ```
      email:
  ```
* ```
        type: string
  ```
* ```
        format: email
  ```
* ```
      password:
  ```
* ```
        type: string
  ```
* ```
        format: password
  ```
* ```
      role:
  ```
* ```
        type: string
  ```
* ```
        enum:
  ```
* ```
          - Admin
  ```
* ```
          - Voluntario
  ```
* ```
          - Beneficiario
  ```
* ```
    example:
  ```
* ```
      id: 1
  ```
* ```
      name: "Juan"
  ```
* ```
      lastname: "Castro"
  ```
* ```
      phone: "3201112233"
  ```
* ```
      email: "juan.modificado@email.com"
  ```
* ```
      role: "Beneficiario"
  ```
*
* ```
  Error:
  ```
* ```
    type: object
  ```
* ```
    properties:
  ```
* ```
      success:
  ```
* ```
        type: boolean
  ```
* ```
        example: false
  ```
* ```
      message:
  ```
* ```
        type: string
  ```
* ```
        example: Error en la operación
  ```

*/
