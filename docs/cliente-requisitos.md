# Requisitos de Cliente — CheckList

**Documento:** Brief de cliente (Fase 0)
**Estado:** 🟢 Aprobado
**Versión:** 1.0
**Fecha:** 2026-06-01

> Documento de requisitos en lenguaje de negocio: recoge **qué** quiere el cliente, no cómo ni cuándo se construye. Es la entrada de la Fase 1, donde el AI Architect lo transformará en `requisitos.md`.

---

## 1. Quiénes somos

Somos un equipo pequeño (entre 5 y 10 personas) que trabaja con **procesos repetitivos**: revisiones, altas de cliente, despliegues, onboarding de personas, checklists de cierre, etc. Hoy gestionamos todo esto con notas sueltas, hojas de cálculo y mensajes de chat. Se nos olvidan pasos y no tenemos forma de saber si una tarea quedó realmente terminada.

Queremos una **aplicación web sencilla de checklist** que sustituya ese caos por algo ordenado y compartido.

## 2. El problema

- Repetimos los mismos procesos una y otra vez, pero **cada persona los hace a su manera**.
- No hay una **fuente única** de "qué pasos hay que dar".
- No sabemos **cuánto falta** para completar un proceso.

## 3. Qué queremos (visión)

> "Quiero abrir la web, ver la lista, marcar lo que voy haciendo y saber de un vistazo qué está hecho y qué falta. Y cuando termine, poder vaciarla y empezar de nuevo."

Una herramienta **minimalista**, rápida de usar, sin curva de aprendizaje. Si hay que leer un manual, hemos fracasado.

## 4. Usuarios

Lo queremos **lo más simple posible**: **no hay cuentas, ni login, ni roles**. Cualquiera que abre la web ve la misma lista y puede trabajar sobre ella.

| Usuario | Qué hace |
|---|---|
| **Persona del equipo** | Abre la web, gestiona las tareas de la lista, las marca como hechas y ve el progreso |

> La lista **no es de nadie**: es compartida. Cualquiera puede añadir, editar, completar o borrar tareas.

## 5. Qué queremos poder hacer

La aplicación es **una única checklist compartida**. No se crean ni se borran listas: la lista siempre existe y el trabajo consiste en gestionar sus tareas.

Cada **tarea** tiene un **título**, una **descripción** opcional y un **estado** (pendiente / hecha).

1. **Añadir tareas** a la lista (título y, opcionalmente, descripción).
2. **Marcar y desmarcar tareas** como hechas.
3. **Editar** el título y la descripción de una tarea.
4. **Borrar tareas.** El borrado es definitivo (no hay papelera).
5. **Ver el progreso** de la lista de un vistazo (p. ej. "7 de 10 hechas", una barra o un porcentaje).
6. **Reordenar las tareas** dentro de la lista (algunas tienen un orden lógico).
7. **Reiniciar la lista.** Cuando todas las tareas están hechas, un botón **vacía la lista borrando todas las tareas** para empezar desde cero. El borrado es definitivo (no hay papelera).

## 6. Preferencias y restricciones

- **Web**, accesible desde el navegador. Sin instalaciones, sin login.
- Tiene que **verse bien en móvil** (mucha gente lo usará desde el teléfono).
- **Interfaz en español.**
- Estética **limpia y neutra**, sin recargar. El diseño visual concreto se definirá más adelante.
- No tenemos preferencia tecnológica concreta: confiamos en vuestra recomendación de stack siempre que sea **sencillo de mantener**.
- Los datos no son sensibles (no hay datos personales de terceros ni información regulada).
