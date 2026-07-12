using Amigo.Domain.Entities;

namespace Amigo.Application.Interfaces;

public interface IPatientRepository
{
    Task<IEnumerable<Patient>> GetAllPatientsAsync();
    Task<Patient?> GetPatientByIdAsync(long id);
    Task<Patient> CreatePatientAsync(Patient patient);
    Task<Patient?> UpdatePatientAsync(long id, Patient patient);
    Task<bool> DeletePatientAsync(long id);
}
