import jsPDF from "jspdf";
import { Order, Invoice } from "../types/interface";

export function generateInvoicePDF(order: Order, invoice: Invoice) {
  const doc = new jsPDF("p", "mm", "a4");
  // Exemple : Positions de base
  let currentY = 20;
  const lineHeight = 7;

  // Titre
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(33, 150, 243);
  doc.text("Reçu de Paiement", 10, currentY);

  // Séparation
  currentY += lineHeight;
  doc.setDrawColor(33, 150, 243);
  doc.setLineWidth(1);
  doc.line(10, currentY, 200, currentY);
  currentY += lineHeight;

  // Afficher la facture
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  // -- Numéro de facture et date
  doc.text(`Facture n°: ${invoice.id}`, 10, currentY);
  currentY += lineHeight;
  doc.text(`Commande n°: ${order.id}`, 10, currentY);
  currentY += lineHeight;
  doc.text(`Date: ${order.createdAt}`, 10, currentY);
  currentY += lineHeight;

  doc.text(
    `Statut du paiement : ${invoice.payment_status.toUpperCase()}`,
    10,
    currentY
  );
  currentY += lineHeight;

  doc.text(`Moyen de paiement : ${invoice.payment_method}`, 10, currentY);
  currentY += lineHeight;

  // -- Billing address
  doc.text("Adresse de facturation :", 10, currentY);
  currentY += lineHeight;
  doc.text(invoice.billing_address || "", 10, currentY);

  currentY += lineHeight * 2;

  // -- Détails des articles
  doc.text("Articles :", 10, currentY);
  currentY += lineHeight;

  // Exemple d'affichage
  order.order_items.forEach((item) => {
    doc.text(
      `Produit #${item.product_id} - Qté : ${item.quantity}`,
      10,
      currentY
    );
    currentY += lineHeight;
  });
  currentY += lineHeight;

  // -- Total
  doc.setFont("helvetica", "bold");
  doc.text(`Montant total : ${order.total_amount} €`, 10, currentY);

  doc.save(`Facture_Commande_${order.id}.pdf`);
}
