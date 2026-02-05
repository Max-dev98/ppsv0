// Classe responsável por armazenar o estado atual do teclado
// Usamos propriedades estáticas para poder acessar de qualquer lugar do jogo
export class Input {
    // movimento horizontal
    static left = false;
    static right = false;
    // pulo
    static jump = false;
    // recarregar (tecla R)
    static reload = false;
    // Inicializa os listeners de teclado
    static init() {
        window.addEventListener('keydown', e => {
            /*
              e.code representa a tecla física pressionada,
              independente do layout do teclado.
      
              KeyA = tecla A - ANDAR PARA ESQUERDA
              KeyD = tecla D - ANDAR PARA DIREITA
              KeyW = tecla W - PULAR
              Space = barra de espaço - PULAR
            */
            if (e.code === 'KeyA')
                Input.left = true;
            if (e.code === 'KeyD')
                Input.right = true;
            // W ou Space fazem pular
            if (e.code === 'KeyW' || e.code === 'Space')
                Input.jump = true;
            // R faz recarregar
            if (e.code === 'KeyR')
                Input.reload = true;
        });
        window.addEventListener('keyup', e => {
            if (e.code === 'KeyA')
                Input.left = false;
            if (e.code === 'KeyD')
                Input.right = false;
            if (e.code === 'KeyW' || e.code === 'Space')
                Input.jump = false;
            if (e.code === 'KeyR')
                Input.reload = false;
        });
    }
}
