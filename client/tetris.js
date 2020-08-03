class Tetris {
    constructor(element) {

        this.element = element;
        this.canvas = element.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.context.scale(20, 20);

        this.arena = new Arena(12, 20);
        this.player = new Player(this);


        this.colors = [
            null,
            'red',
            'lightcoral',
            'crimson',
            'darkred',
            'maroon',
            'tomato',
            'firebrick',
        ]

        let last_time = 0;
        const update = (time = 0) => {
            const deltatime = time - last_time;
            last_time = time;
            this.player.update(deltatime);

            this.draw();
            requestAnimationFrame(update);
        };
        update();

        this.update_score(0);
    }

    draw() {
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.draw_matrix(this.arena.matrix, { x: 0, y: 0 });
        this.draw_matrix(this.player.matrix, this.player.pos);
    }

    draw_matrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.context.fillStyle = this.colors[value];
                    this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    update_score(score) {
        this.element.querySelector('.score').innerText = score;
    }
}