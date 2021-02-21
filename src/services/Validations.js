export default class Validations {

    /**
     * Check email validation.
     *
     * @param email
     * @returns {boolean}
     */
    static checkEmail(email) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
    }

    /**
     * Min character length validation.
     *
     * @param name
     * @param minLength
     * @returns {boolean}
     */
    static minLength(name, minLength) {
        return name.length >= minLength;
    }
}