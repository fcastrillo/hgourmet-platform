# ENABLER-1: Cloudflare Tunnel para preview compartible en desarrollo

## Objetivo del Enabler

- **Para**: Dueñas/administradoras de HGourmet y stakeholders de validación
- **Que**: necesitan revisar avances sin depender de acceso local a la laptop de desarrollo
- **Este enabler**: habilita un endpoint público temporal/estable para el entorno local mediante Cloudflare Tunnel
- **Esperamos**: acelerar ciclos de feedback y reducir fricción de revisión pre-deploy
- **Sabremos que hemos tenido éxito cuando**: cada iteración tenga al menos 1 demo compartible funcional, se valide la estrategia de deployment (Railway + Cloudflare o equivalente), y se acuerde la transición de estrategia Git de `trunk` a `feature` con VoBo previo a publicar en `main`

## Contexto

Sin túnel, la demo solo vive en `localhost`, lo que dificulta revisiones remotas con stakeholders.
Con túnel activo, se habilita un enlace compartible (ej. `demo.hgourmet.com.mx`) para validar UX/flujo
antes de merge a `main` y antes de exponer producción en `hgourmet.com.mx`.

Este enabler también reduce riesgo en la discusión de deployment:

1. Aísla un entorno de preview para pruebas de negocio.
2. Permite acordar arquitectura de publicación (Railway + Cloudflare o alternativa).
3. Habilita gobierno de cambios: trabajar por rama feature, validar en preview y promover a `main` solo con VoBo.

## Alcance Técnico

1. Instalar y verificar `cloudflared` en el entorno dev.
2. Definir comando operativo `npm run tunnel` apuntando al puerto local del proyecto.
3. Documentar flujo de uso y contingencia en caso de URL expirada o túnel caído.
4. Documentar criterios de transición de estrategia Git (`trunk` -> `feature`) posterior a validación de preview/deployment.

### Comandos operativos definidos

- `npm run tunnel:check` valida presencia de `cloudflared`.
- `npm run tunnel` usa `cloudflared/config.yml` para exponer `localhost:3000` en dominio fijo (`demo.hgourmet.com.mx`).
- `npm run tunnel:quick` expone `localhost:${TUNNEL_PORT:-3000}` en URL temporal (fallback).

## Riesgos y Mitigación

- **Riesgo:** URL efímera deja de funcionar durante demo.
  - **Mitigación:** Procedimiento de reinicio rápido + actualización de enlace en canal de coordinación.
- **Riesgo:** Se confunde demo con ambiente productivo.
  - **Mitigación:** Naming estricto (`demo.*` vs `hgourmet.com.mx`) y checklist pre-demo.
- **Riesgo:** Cambios en `main` sin VoBo.
  - **Mitigación:** Definir política de publicación: review en preview y aprobación explícita antes de merge.

## Criterios de Aceptación

1. Existe un comando documentado que expone el entorno local en URL pública.
2. Stakeholders pueden abrir y navegar el flujo base del storefront desde un enlace compartido.
3. Existe guía de recuperación operativa para caída/expiración del túnel.
4. Se documenta decisión de estrategia de deployment y su relación con el cambio futuro a Git feature mode.

## BDD (Enabler)

- **Dado que** el servidor local está ejecutándose en el puerto objetivo,  
  **Cuando** ejecuto `npm run tunnel`,  
  **Entonces** se genera una URL pública accesible para compartir la demo.

- **Dado que** una stakeholder abre el enlace de preview,  
  **Cuando** recorre el flujo principal del storefront,  
  **Entonces** puede validar funcionalidad y emitir VoBo/feedback sin acceso al entorno local.

- **Dado que** el túnel puede caer o expirar,  
  **Cuando** un enlace deja de responder durante revisión,  
  **Entonces** se ejecuta el procedimiento de recuperación (reinicio + nuevo enlace) y se restablece la demo sin bloquear el avance.

## Dependencias

- Dominio y DNS en Cloudflare para separar `demo.hgourmet.com.mx` de `hgourmet.com.mx`.
- Definición de arquitectura de runtime (Railway + Cloudflare o alternativa compatible).
- Alineación de estrategia Git para adopción de flujo por ramas `feature` posterior al piloto de preview.

## Estado actual (temporal)

- Conector de túnel registrado y operativo.
- Comandos/documentación de operación y fallback completados.
- Cierre definitivo pendiente por acceso a configuración DNS de la zona para resolver `demo.hgourmet.com.mx`.
