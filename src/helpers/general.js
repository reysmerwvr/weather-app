export function handleError(error) {
    if (error !== undefined) {
        if (error.response) {
            if (error.response.status < 500) {
                const errorMessage = error.response.data.message;
                console.error(errorMessage);
            }
        } else {
            console.error(error);
        }
    }
}

export function retrieveActionCreator(action, object) {
    return {
        type: action,
        payload: object
    };
}

export const defaultErrorMessage = 'Oops! Something went wrong';