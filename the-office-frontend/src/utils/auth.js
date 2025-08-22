export const getRolesFromToken = (token) => {
    if(!token) return [];
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload?.realm_access?.roles || [];
    } catch(err) {
        console.error("Error decoding token", err);
        return [];
    }
};