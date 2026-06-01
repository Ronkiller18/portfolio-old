// ======================================================
// Findings Store
// ======================================================

let findingsStore = [];


// ======================================================
// Clear Store
// ======================================================

export function clearFindings() {

    findingsStore = [];
}


// ======================================================
// Add Findings
// ======================================================

export function addFindings(source, findings) {

    if (!Array.isArray(findings)) {
        return;
    }

    const normalized = findings.map(finding => ({

        ...finding,

        source

    }));

    findingsStore.push(...normalized);
}


// ======================================================
// Get Findings
// ======================================================

export function getFindings() {

    return [...findingsStore];
}


// ======================================================
// Get Finding Count
// ======================================================

export function getFindingCount() {

    return findingsStore.length;
}


// ======================================================
// Check If Store Is Empty
// ======================================================

export function hasFindings() {

    return findingsStore.length > 0;
}