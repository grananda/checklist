# AGENTS.md — CheckList

Repositorio piloto de la metodología **Native AI · AIDD-SDD** (ver `.claude/methodology/native-ai-aidd-sdd.md`).

- **AIDD** (`aidd *`) — planificación, diseño y entrega (Fases 0-2 y 3.5). Genera los `docs/`.
- **native-ai-specs** (`native-ai *`) — ejecución spec-driven sobre OpenSpec (Fases 3 y 4+).
- Documento de arquitectura (insumo principal del roadmap): `docs/arquitectura-base.md`.

<!-- BEGIN native-ai-specs commands (auto-generado, no editar a mano) -->
## Comandos native-ai-specs

Skill `native-ai-specs` v1.4.0. Invoca estos comandos para trabajar con especificaciones Native AI / OpenSpec:

- `native-ai init` — inicializa OpenSpec y comprueba dependencias.
- `native-ai roadmap` — fasea el desarrollo y genera `docs/roadmap.md`, `docs/prompts-roadmap-native-ai.md` y la seccion `roadmap` de `openspec/config.yaml`.
- `native-ai open change <what-you-want-to-build>` — pre-flight de dudas y creacion del cambio OpenSpec.
- `native-ai implement change <what-you-want-to-build>` — pre-flight de dudas y aplicacion de instrucciones del cambio.
- `native-ai close change <what-you-want-to-build>` — archiva el cambio OpenSpec.
- `native-ai prototype-ux [what-you-want-to-build]` — genera prototipos UX con `booster-ux`.
- `native-ai uml <what-you-want-to-build>` — genera el HTML de diagramas del cambio con `booster-uml`.
<!-- END native-ai-specs commands -->
