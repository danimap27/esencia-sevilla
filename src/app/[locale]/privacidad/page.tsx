import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { APARTMENT } from '@/data/apartment';

export const metadata: Metadata = {
  title: 'Política de Privacidad — Esencia Sevilla',
  robots: { index: true, follow: true },
};

export default function PrivacidadPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-24">
        <nav className="text-sm text-tinta/50 mb-8">
          <Link href={`/${locale}`} className="hover:text-tinta">Inicio</Link>
          <span className="mx-2">›</span>
          <span>Política de Privacidad</span>
        </nav>

        <h1 className="text-4xl font-serif text-tinta mb-8">Política de Privacidad</h1>

        <div className="prose prose-tinta max-w-none space-y-6 text-tinta/80 leading-relaxed">
          <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section>
            <h2 className="text-2xl font-serif text-tinta mt-8 mb-3">1. Responsable del tratamiento</h2>
            <p>
              En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), le informamos que el responsable del tratamiento de sus datos personales es:
            </p>
            <ul className="list-none space-y-1 ml-0 pl-4 border-l-2 border-terracota-200">
              <li><strong>Nombre:</strong> Esencia Sevilla</li>
              <li><strong>Dirección:</strong> {APARTMENT.address}</li>
              <li><strong>Email:</strong> {APARTMENT.email}</li>
              <li><strong>Nº Registro Turístico:</strong> {APARTMENT.registrationNumber}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-tinta mt-8 mb-3">2. Datos que recabamos</h2>
            <p>Recabamos los siguientes datos personales:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Datos de reserva:</strong> nombre, email, teléfono, fechas de estancia, número de huéspedes</li>
              <li><strong>Datos de pago:</strong> procesados exclusivamente por Stripe (no almacenamos datos bancarios)</li>
              <li><strong>Pre-check-in:</strong> datos del documento de identidad, fecha de nacimiento, nacionalidad (exigidos por ley)</li>
              <li><strong>Comunicaciones:</strong> mensajes de chat o email enviados a través del sitio</li>
              <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, páginas visitadas (mediante Google Analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-tinta mt-8 mb-3">3. Finalidad y base legal</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Gestión de reservas:</strong> ejecución del contrato (Art. 6.1.b RGPD)</li>
              <li><strong>Registro de viajeros:</strong> obligación legal — Ley Orgánica 4/2015 de Seguridad Ciudadana (Art. 6.1.c RGPD)</li>
              <li><strong>Comunicaciones sobre la reserva:</strong> ejecución del contrato</li>
              <li><strong>Marketing/newsletter:</strong> consentimiento del interesado (Art. 6.1.a RGPD)</li>
              <li><strong>Analytics:</strong> interés legítimo para mejorar el servicio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-tinta mt-8 mb-3">4. Cesión de datos a terceros</h2>
            <p>Sus datos podrán ser cedidos a:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Fuerzas y Cuerpos de Seguridad</strong> (SES.HOSPEDERÍA): obligación legal</li>
              <li><strong>Stripe Inc.</strong>: para el procesamiento de pagos (certificado PCI-DSS)</li>
              <li><strong>Resend/SendGrid</strong>: para el envío de emails transaccionales</li>
              <li><strong>Supabase</strong>: almacenamiento de datos (servidores en la UE)</li>
              <li><strong>Google Analytics</strong>: datos anonimizados para análisis de tráfico</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-tinta mt-8 mb-3">5. Conservación de datos</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>Datos de reserva: 5 años (obligación fiscal)</li>
              <li>Datos del registro de viajeros: 3 años (normativa policial)</li>
              <li>Datos de comunicaciones: hasta 2 años tras el último contacto</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-tinta mt-8 mb-3">6. Sus derechos</h2>
            <p>Puede ejercer los siguientes derechos enviando un email a {APARTMENT.email}:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Acceso:</strong> conocer qué datos tenemos sobre usted</li>
              <li><strong>Rectificación:</strong> corregir datos incorrectos</li>
              <li><strong>Supresión:</strong> solicitar el borrado (cuando no haya obligación legal)</li>
              <li><strong>Portabilidad:</strong> recibir sus datos en formato electrónico</li>
              <li><strong>Oposición:</strong> oponerse al tratamiento para marketing</li>
              <li><strong>Limitación:</strong> restringir el tratamiento en determinadas circunstancias</li>
            </ul>
            <p className="mt-3">También puede presentar una reclamación ante la <a href="https://www.aepd.es" className="text-terracota-500 hover:underline" target="_blank" rel="noopener">Agencia Española de Protección de Datos (AEPD)</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-tinta mt-8 mb-3">7. Cookies</h2>
            <p>Utilizamos cookies propias (sesión) y de terceros (Google Analytics, Meta Pixel). Puede gestionar sus preferencias en el banner de cookies o en la configuración de su navegador.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
