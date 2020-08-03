class TetrisManager {

    constructor(document) {
        this.document = document;
        this.template = document.getElementById('playertemplate');
        this.instances = new Set;
    }

    create_player() {
        const element = this.document.importNode(this.template.content, true).children[0];

        const tetris = new Tetris(element);
        this.instances.add(tetris);

        this.document.body.appendChild(tetris.element);

        return tetris;
    }

    remove_player(tetris) {
        this.instances.delete(tetris);
        this.document.body.removeChild(tetris.element);
    }
}