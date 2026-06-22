# notes-v1 — Pantalla principal de CheckList

**Escena fisica.** Una persona del equipo de operaciones, en su escritorio a media manana, a mitad de un despliegue, mira de reojo el checklist en una segunda pantalla (o en el movil) para saber "que falta" sin perder el foco del trabajo principal. Luz de oficina, animo concentrado y algo tenso: es light, no dark. El dark seria una pose nocturna que no encaja con este uso diurno y utilitario.

**Color strategy: Restrained** (neutros + 1 acento). Lienzo y superficies neutros tintados hacia el hue de marca (255) con chroma 0.004-0.012; un unico acento azul OKLCH (`oklch(0.510 0.150 255)`) para accion y progreso. Verde (`done`) y rojo (`danger`) reservados solo para estado "hecha" y borrado, nunca decorativos. Justificacion: app sobria interna; mas color seria ruido, no jerarquia.

**Tema:** light. Nunca #000 ni #fff puros (ink `0.255`, surface `0.998`).

**Top-2 movimientos anti-reflejo:**
1. El acento azul tiene caracter (chroma 0.15, no el azul corporativo lavado) y aparece con intencion: barra, primario y wash suave en hover de editar; la barra vira a verde al 100%.
2. Espaciado VARIADO y ritmo por estado: las tareas hechas son mas compactas y atenuadas (py-3, tachado + opacidad), las pendientes respiran mas (py-4). La lista no es una rejilla identica.

**Interactivo:** marcar/desmarcar (con tachado + icono + badge, no solo color) recalcula progreso en vivo; "Anadir tarea" abre modal, valida titulo no vacio (rechaza solo espacios, contadores 120/2000); "Editar" precarga el modal; "Borrar" pide confirmacion antes de eliminar; estado vacio con CTA y progreso "0 de 0" sin division por cero.
