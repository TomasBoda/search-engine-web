
export abstract class Processor<Object> {

    public abstract process(text: string): Object;
}