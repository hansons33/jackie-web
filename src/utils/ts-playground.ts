type MyPick<T, U extends keyof T> = {
    [P in U]: T[P];
};

type MyReadOnly<T> = {
    readonly [K in keyof T]: T[K];
};
const tuple = ['tesla', 'model 3', 'model X'] as const;
type TupleToObject<K extends PropertyKey> = {
    [P in K]: P;
};

// test
type Obj = {
    name: string;
    age: number;
};
const a: MyPick<Obj, 'age'> = {
    age: 123
};
const b: MyReadOnly<Obj> = {
    name: 'czq',
    age: 123
};
