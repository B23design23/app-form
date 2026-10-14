# Maquettes de référence (refonte DA, octobre 2026)

Ces fichiers sont des **références visuelles**, pas du code à copier.

## Comment s'en servir

- Lis les valeurs exactes (couleurs, rayons, espacements, tailles et graisses de texte) dans le HTML.
- Reconstruis avec les composants React et les tokens CSS existants du projet. Ne recopie pas les styles en ligne.
- Les données affichées sont fictives (prénoms, titres de cours, XP, compteurs) : les vraies viennent de Supabase.
- Les règles écrites (CLAUDE.md et instructions du lot) restent la source de vérité. Une maquette montre un état figé. Elle ne dit pas quand un bloc apparaît, disparaît ou passe en tête.
- En cas d'écart entre une maquette et une instruction, suis l'instruction et signale l'écart.

## Images

Les images sont remplacées par un libellé `[IMAGE: nom]`. Ce sont des placeholders (Fluent Emoji de Microsoft, licence MIT) :

| Libellé | Objet |
| --- | --- |
| badge-eclair | Badge Éclair, aussi utilisé pour l'XP et le quiz flash |
| badge-premier-pas | Badge Premier pas |
| badge-sur-le-terrain | Badge Sur le terrain |
| badge-perseverant-expert | Badges Persévérant et Expert (même image provisoire) |
| badge-sans-faute | Badge Sans faute |
| theme-cycle-frigorifique | Objet du thème Cycle frigorifique et composants |
| theme-technologies-systemes | Objet du thème Technologies et systèmes clim |
| theme-installation | Objet du thème Installation et mise en service |
| theme-diagnostic | Objet du thème Diagnostic et dépannage |
| theme-reglementation-securite | Objet du thème Réglementation et sécurité |

Les badges gardent leurs illustrations actuelles pour l'instant. Les objets de thème seront ajoutés dans un lot dédié.

## Fichiers

| Fichier | État |
| --- | --- |
| apprenant-mobile-etat-1-premier-jour | Aucun cours commencé |
| apprenant-mobile-etat-2-cours-en-cours-flash-verrouille | Un cours en cours, quiz flash verrouillé |
| apprenant-mobile-etat-3-cours-en-cours-flash-debloque | Un cours en cours, quiz flash débloqué |
| apprenant-mobile-etat-4-rien-en-cours | Rien en cours, quiz flash en tête |
| apprenant-mobile-etat-5-collection-complete | 6 badges obtenus (vitrine 7 jours, puis ligne compacte en bas) |
| apprenant-mobile-etat-6-tous-cours-termines | Bibliothèque terminée |
| apprenant-mobile-etat-7-cours-perso-et-formateur | Cours perso en cours et cours assignés par le formateur |
| apprenant-mobile-etat-8-cours-formateur-en-tete | Rien en cours, cours assigné en tête |
| apprenant-desktop-etat-7 | Version desktop de l'état 7 |
| formateur-desktop-dashboard | Dashboard formateur (fond #F4F4F6, pastille de statut sous le taux) |
