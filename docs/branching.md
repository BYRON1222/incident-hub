# Estrategia de ramas

- `main`: siempre estable; protegida con política de ramas (PR obligatorio, 1 revisor mínimo, work item vinculado, build validation).
- Ramas de trabajo: `feature/AB<ID>-descripcion`, `fix/AB<ID>-descripcion`, `refactor/AB<ID>-descripcion`.
- Commits: `tipo: descripción AB#<ID>` (tipos: feat, fix, refactor, docs, ci, chore).
- Merge: squash merge a `main`, borrando la rama.
- Versiones: tag anotado `vX.Y.Z` sobre `main` (ver `release-strategy.md`).

Flujo: Task → rama → commit (AB#ID) → PR → review → main → pipeline → artefacto → release.
