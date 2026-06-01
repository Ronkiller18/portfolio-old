// ============================================================
// Finding Factory
// ============================================================

export function createFinding({
    type,
    severity,
    description,
    recommendation,
    confidence = 100,
    payloads = []
}) {

    return {
        type,
        severity,
        description,
        recommendation,
        confidence,
        payloads
    };
}