import Image from "next/image";
import Link from "next/link";
import heroBg from "@/public/heroBG.jpg";
import pulseIcon from "@/public/pulse.svg";
import homeIcon from "@/public/home.svg";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="authPage">
      <section className="authHero" aria-hidden="true">
        <Image
          className="authHeroImage"
          src={heroBg}
          alt=""
          priority
          fill
          sizes="50vw"
        />
        <Image className="authHeroPulse" src={pulseIcon} alt="" width={400} height={400} />
        <div className="authHeroContent">
          <p className="authHeroBadge">CareTrack Clinic MRMS</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <ul className="authHeroFeatures">
            <li>Secure patient records</li>
            <li>Appointment management</li>
            <li>Role-based access control</li>
          </ul>
        </div>
      </section>

      <section className="authPanel">
        <Link className="goHome" href="/" aria-label="Go to home">
          <Image src={homeIcon} alt="" width={25} height={25} />
        </Link>
        <div className="authPanelInner">{children}</div>
      </section>
    </div>
  );
}
