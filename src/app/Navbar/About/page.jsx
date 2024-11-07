import Navheader from "@/components/Navheader/page";
export default function DoctorDashboard() {
    const teamMembers = [
        {
          name: "John Anderson",
          position: "CEO & Founder",
          image: "/images/team/john_anderson.jpg",
          description: "Founder of Medlink, John is committed to transforming digital healthcare access."
        },
        {
          name: "Mayuri Naresh Barapatre",
          position: "CSE 3rd year Student",
          image: "/image/img.png",
          description: "I am a  3rd year CSE student at RCOEM. I am interested in AI and Machine Learning.",

        },
        {
          name: "Sarah Brown",
          position: "Head of Product",
          image: "/images/team/sarah_brown.jpg",
          description: "Sarah drives the product vision with a focus on user-centered design and experience."
        }
      ];    
    return  (
        <>
        <Navheader />
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">About Us</h1>
        <p className="text-lg text-gray-600">
          At Medlink, we connect healthcare professionals and patients through a streamlined, reliable platform that enhances medical accessibility and fosters collaboration.
        </p>
      </section>

      {/* Vision Section */}
      <section className="mt-12">
        <div className="bg-white rounded-lg shadow-md p-8 md:flex md:items-center md:justify-between">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Vision</h2>
            <p className="text-gray-600">
              To transform healthcare accessibility and quality worldwide by empowering people with innovative tools and seamless digital connections.
            </p>
          </div>
          <div className="md:w-1/3 text-center mt-4 md:mt-0">
            <img
              src="/image/vi.jpg"
              alt="Vision of Medlink"
              className="w-auto h-40 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mt-12">
        <div className="bg-white rounded-lg shadow-md p-8 md:flex md:items-center md:justify-between">
          <div className="md:w-1/3 text-center mb-4 md:mb-0">
            <img
              src="/images/mission.jpg"
              alt="Mission of Medlink"
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h2>
            <p className="text-gray-600">
              To simplify the healthcare journey for both patients and providers through an accessible, efficient platform that enhances communication, trust, and quality of care.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Example Team Member */}
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-medium text-gray-800">{member.name}</h3>
              <p className="text-gray-500 text-sm">{member.position}</p>
              <p className="text-gray-600 mt-2">{member.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
        </>
    );
}