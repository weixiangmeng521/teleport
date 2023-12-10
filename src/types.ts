export type EmitDataType<T> = {
    data:T,
    callback?:(() => void),
}