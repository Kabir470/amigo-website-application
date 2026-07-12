using Amigo.Application.Interfaces;
using Amigo.Domain.Entities;
using Amigo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Amigo.Infrastructure.Repositories;

public class PatientRepository : IPatientRepository
{
    private readonly AmigoDbContext _context;

    public PatientRepository(AmigoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Patient>> GetAllPatientsAsync()
    {
        return await _context.Patients
            .Include(p => p.Ward)
            .Include(p => p.AssignedRobot)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Patient?> GetPatientByIdAsync(long id)
    {
        return await _context.Patients
            .Include(p => p.Ward)
            .Include(p => p.AssignedRobot)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Patient> CreatePatientAsync(Patient patient)
    {
        patient.CreatedAt = DateTime.UtcNow;
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
        return patient;
    }

    public async Task<Patient?> UpdatePatientAsync(long id, Patient updated)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null) return null;

        patient.FirstName = updated.FirstName;
        patient.LastName = updated.LastName;
        patient.Age = updated.Age;
        patient.WardId = updated.WardId;
        patient.RoomNumber = updated.RoomNumber;
        patient.Condition = updated.Condition;
        patient.NfcTag = updated.NfcTag;
        patient.AssignedRobotId = updated.AssignedRobotId;
        patient.Status = updated.Status;

        await _context.SaveChangesAsync();
        return patient;
    }

    public async Task<bool> DeletePatientAsync(long id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null) return false;
        _context.Patients.Remove(patient);
        await _context.SaveChangesAsync();
        return true;
    }
}
