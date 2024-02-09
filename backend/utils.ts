/**
 * Given a list of async function, this method will execute them in a serial way
 *
 * @param tasks The list of async function (task) to execute in serial
 * @returns An array of result as a promise
 */
export async function taskInSeries<T>(
  tasks: Array<() => Promise<T>>
): Promise<Array<T>> {
  return tasks.reduce((promiseChain, currentTask) => {
    return promiseChain.then((chainResults) => {
      return currentTask().then((currentResult) => {
        return [...chainResults, currentResult];
      });
    });
  }, Promise.resolve([] as Array<T>));
}
