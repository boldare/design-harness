/** How long the prototype server takes to answer, about as long as in the original Atlas prototype. */
export const responseDelay = 1600;

/** Story helper: resolves with `answer` after responseDelay, like a server would. */
export function respond<T>(answer: T) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(answer), responseDelay));
}
