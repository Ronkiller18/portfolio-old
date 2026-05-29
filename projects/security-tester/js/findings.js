let findingsStore = [];

export function clearFindings() {

    findingsStore = [];
}

export function addFindings(source, findings) {

    const normalized = findings.map(finding => ({
        ...finding,
        source
    }));

    findingsStore.push(...normalized);
}

export function getFindings() {

    return findingsStore;
}