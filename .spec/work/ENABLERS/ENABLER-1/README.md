# ENABLER-1: Cloudflare Tunnel para preview compartible en desarrollo

## Objetivo del Enabler

- **Para**: Dueñas/administradoras de HGourmet y stakeholders de validación
- **Que**: necesitan revisar avances sin depender de acceso local a la laptop de desarrollo
- **Este enabler**: habilita un endpoint público temporal/estable para el entorno local mediante Cloudflare Tunnel
- **Esperamos**: acelerar ciclos de feedback y reducir fricción de revisión pre-deploy
- **Sabremos que hemos tenido éxito cuando**: cada iteración tenga al menos 1 demo compartible funcional en `demo.hgourmet.com.mx`, y el flujo operativo quede claro: ramas feature para demo y `main` para producción (`www.hgourmet.com.mx`)

## Contexto

Sin túnel, la demo solo vive en `localhost`, lo que dificulta revisiones remotas con stakeholders.
Con túnel activo, se habilita un enlace compartible (ej. `demo.hgourmet.com.mx`) para validar UX/flujo
antes de merge a `main` y antes de exponer producción en `hgourmet.com.mx`.

Este enabler también reduce riesgo operativo al separar claramente demo y producción:

1. Aísla un entorno de preview para pruebas de negocio.
2. Evita confusión entre ambiente de validación y ambiente público.
3. Habilita gobierno de cambios: trabajar por rama feature, validar en demo y promover a `main` solo con VoBo.

## Alcance Técnico

1. Instalar y verificar `cloudflared` en el entorno dev.
2. Definir comando operativo `npm run tunnel` apuntando al puerto local del proyecto.
3. Documentar flujo de uso y contingencia en caso de URL expirada o túnel caído.
4. Documentar el modelo operativo vigente (`main` producción, `feature` demo con túnel).

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
4. Se documenta y valida el modelo operativo vigente de ramas + dominios.

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
- Proyecto productivo en Vercel con `www.hgourmet.com.mx` validado.
- Flujo de ramas definido: feature para demo, `main` para producción.

## Estado actual

- Conector de túnel registrado y operativo con dominio fijo.
- Comandos/documentación de operación y fallback completados.
- DNS de demo y producción configurados para operación vigente.

## Decisiones operativas vigentes

- Producción se despliega desde `main` en `www.hgourmet.com.mx` (Vercel).
- El desarrollo diario ocurre en ramas feature con preview local por túnel.
- Vercel Preview por rama no forma parte del flujo operativo en esta etapa.
- `npm run tunnel:quick` se mantiene como fallback temporal durante propagación DNS.
