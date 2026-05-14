export interface InputState {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    targetX?: number;
    targetY?: number;
}

const KEY_MAP: Record<string, keyof Omit<InputState, 'targetX' | 'targetY'>> = {
    'w': 'up',
    's': 'down',
    'a': 'left',
    'd': 'right',
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
};

export class InputHandler {
    public state: InputState;
    public mouseScreenX: number = window.innerWidth / 2;
    public mouseScreenY: number = window.innerHeight / 2;

    constructor() {
        this.state = { 
            up: false, 
            down: false, 
            left: false, 
            right: false 
        };
        this.setupListeners();
    }

    private setupListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouseScreenX = e.clientX;
            this.mouseScreenY = e.clientY;
        });

        window.addEventListener('keydown', (e) => this.handleKey(e.key, true));
        window.addEventListener('keyup', (e) => this.handleKey(e.key, false));
    }

    private handleKey(key: string, isDown: boolean) {
        const action = KEY_MAP[key];
        if (action) {
            this.state[action] = isDown;
        }
    }

    public update(playerPos: { x: number, y: number }, canvas: HTMLCanvasElement) {
        this.state.targetX = this.mouseScreenX + playerPos.x - canvas.width / 2;
        this.state.targetY = this.mouseScreenY + playerPos.y - canvas.height / 2;
    }
}
