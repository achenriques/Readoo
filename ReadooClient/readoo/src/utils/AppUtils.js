export const getIdioma = function () { 
    return 'Español' 
};

export const getPaginaActual = function (index) {
    switch (index) {
        case 0:
            return 'explorando libros'

        case 1:
            return 'viendo mis gustos'

        case 2:
            return 'chateando'

        case 3:
            return 'viendo mi perfil'

        default:
            return 'Readoo'
    }
};