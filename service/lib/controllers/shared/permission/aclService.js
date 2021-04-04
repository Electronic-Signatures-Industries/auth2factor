class AclService {
    checkAcl(currentAccessRequest, config) {
        if (config && config.acl) {
            let hasAcl = (config.acl.items || []).find(v => currentAccessRequest === v);
            if (hasAcl) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    }
}

module.exports = AclService;